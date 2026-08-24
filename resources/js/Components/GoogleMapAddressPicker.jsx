import { useEffect, useRef, useState } from 'react';
import { Crosshair, Loader2, MapPinned } from 'lucide-react';

let googleMapsPromise;
const GOOGLE_MAPS_CALLBACK = '__titipsiniGoogleMapsReady';

function loadGoogleMaps() {
    if (window.google?.maps) return Promise.resolve(window.google.maps);
    if (googleMapsPromise) return googleMapsPromise;

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return Promise.reject(new Error('Google Maps API key belum dikonfigurasi.'));

    googleMapsPromise = new Promise((resolve, reject) => {
        window[GOOGLE_MAPS_CALLBACK] = () => {
            delete window[GOOGLE_MAPS_CALLBACK];
            resolve(window.google.maps);
        };

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&loading=async&callback=${GOOGLE_MAPS_CALLBACK}`;
        script.async = true;
        script.defer = true;
        script.onerror = () => {
            delete window[GOOGLE_MAPS_CALLBACK];
            reject(new Error('Google Maps gagal dimuat.'));
        };
        document.head.appendChild(script);
    });

    return googleMapsPromise;
}

function getComponent(result, type) {
    return result.address_components.find((component) => component.types.includes(type))?.long_name ?? '';
}

function getFirstComponent(result, types) {
    return types.map((type) => getComponent(result, type)).find(Boolean) ?? '';
}

async function reverseGeocodeFallback(lat, lng) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);

    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=id`,
            { signal: controller.signal },
        );
        if (!response.ok) throw new Error('Layanan pencari alamat sedang tidak tersedia.');

        const result = await response.json();
        if (!result.display_name) throw new Error('Alamat tidak ditemukan di titik tersebut.');

        return {
            address: result.display_name,
            province: result.address?.state ?? '',
            city: result.address?.city
                ?? result.address?.county
                ?? result.address?.municipality
                ?? result.address?.town
                ?? '',
            district: result.address?.city_district
                ?? result.address?.district
                ?? result.address?.suburb
                ?? result.address?.village
                ?? (result.address?.county && result.address?.town ? result.address.town : '')
                ?? '',
        };
    } finally {
        window.clearTimeout(timeout);
    }
}

export default function GoogleMapAddressPicker({ onAddressSelect }) {
    const mapElement = useRef(null);
    const mapInstance = useRef(null);
    const geocoderInstance = useRef(null);
    const marker = useRef(null);
    const onAddressSelectRef = useRef(onAddressSelect);
    const [loading, setLoading] = useState(true);
    const [picking, setPicking] = useState(false);
    const [error, setError] = useState('');

    onAddressSelectRef.current = onAddressSelect;

    function selectLocation(lat, lng) {
        const maps = window.google?.maps;
        if (!maps || !mapInstance.current || !geocoderInstance.current) return;

        setPicking(true);
        const position = new maps.LatLng(lat, lng);
        mapInstance.current.panTo(position);
        mapInstance.current.setZoom(17);
        geocoderInstance.current.geocode({ location: position }, async (results, status) => {
            let selectedAddress;
            if (status === 'OK' && results?.[0]) {
                const result = results[0];
                selectedAddress = {
                    address: result.formatted_address,
                    province: getComponent(result, 'administrative_area_level_1'),
                    city: getFirstComponent(result, [
                        'administrative_area_level_2',
                        'locality',
                    ]),
                    district: getFirstComponent(result, [
                        'administrative_area_level_3',
                        'administrative_area_level_4',
                        'sublocality_level_1',
                        'sublocality',
                    ]),
                };

                if (!selectedAddress.province || !selectedAddress.city || !selectedAddress.district) {
                    try {
                        const fallback = await reverseGeocodeFallback(lat, lng);
                        selectedAddress = {
                            address: selectedAddress.address || fallback.address,
                            province: selectedAddress.province || fallback.province,
                            city: selectedAddress.city || fallback.city,
                            district: selectedAddress.district || fallback.district,
                        };
                    } catch {
                        // Google address remains usable even if the fallback is unavailable.
                    }
                }
            } else {
                try {
                    selectedAddress = await reverseGeocodeFallback(lat, lng);
                } catch (reason) {
                    setError(`${reason.message} Cek izin lokasi dan koneksi internet.`);
                    setPicking(false);
                    return;
                }
            }

            marker.current?.setMap(null);
            marker.current = new maps.Marker({
                map: mapInstance.current,
                position,
                title: 'Lokasi saya',
            });
            onAddressSelectRef.current(selectedAddress);
            setError('');
            setPicking(false);
        });
    }

    function useCurrentLocation() {
        if (!navigator.geolocation) {
            setError('Browser ini tidak mendukung GPS.');
            return;
        }

        setError('');
        setPicking(true);
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => selectLocation(coords.latitude, coords.longitude),
            () => {
                setError('Lokasi tidak bisa diakses. Izinkan GPS pada browser, lalu coba lagi.');
                setPicking(false);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
        );
    }

    useEffect(() => {
        let cancelled = false;

        loadGoogleMaps()
            .then((maps) => {
                if (cancelled || !mapElement.current) return;

                const map = new maps.Map(mapElement.current, {
                    center: { lat: -7.7956, lng: 110.3695 },
                    zoom: 13,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                });
                const geocoder = new maps.Geocoder();
                mapInstance.current = map;
                geocoderInstance.current = geocoder;

                map.addListener('click', ({ latLng }) => {
                    selectLocation(latLng.lat(), latLng.lng());
                });
                setLoading(false);
            })
            .catch((reason) => {
                if (!cancelled) {
                    setError(reason.message);
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
            marker.current?.setMap(null);
            mapInstance.current = null;
            geocoderInstance.current = null;
        };
    }, []);

    return (
        <div className="mt-3 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="relative h-64 bg-slate-100 dark:bg-gray-800">
                <div ref={mapElement} className="h-full w-full" />
                <button
                    type="button"
                    onClick={useCurrentLocation}
                    disabled={loading || picking}
                    className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-bold text-gray-700 shadow-md transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
                >
                    <Crosshair size={15} className="text-[#008736]" />
                    Gunakan lokasi saya
                </button>
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-slate-100 text-xs font-semibold text-gray-500 dark:bg-gray-800 dark:text-gray-300">
                        <Loader2 size={16} className="animate-spin" /> Memuat peta...
                    </div>
                )}
                {picking && (
                    <div className="absolute left-1/2 top-3 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-md dark:bg-gray-900 dark:text-gray-200">
                        <Loader2 size={14} className="animate-spin" /> Mencari alamat...
                    </div>
                )}
                {!loading && !error && (
                    <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white/95 px-3 py-2 text-xs font-semibold text-gray-700 shadow-md dark:bg-gray-900/95 dark:text-gray-200">
                        <MapPinned size={14} className="text-[#008736]" /> Klik titik lokasi di peta
                    </div>
                )}
            </div>
            {error && (
                <p className="bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
                    {error}
                </p>
            )}
        </div>
    );
}