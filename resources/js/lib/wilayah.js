/**
 * Utility wilayah (provinsi / kabupaten-kota / kecamatan).
 *
 * Dipakai untuk menormalkan & mencocokkan nama wilayah yang berasal dari
 * Google Maps Geocoding API (address_components) atau Nominatim OpenStreetMap
 * dengan daftar wilayah pada API /api/wilayah, sehingga dropdown pada form
 * "Alamat Gudang" otomatis terpilih saat tombol "Gunakan Lokasi Saat Ini"
 * ditekan.
 */

/**
 * Bersihkan nama wilayah agar bisa dicocokkan:
 * - lowercase
 * - buang tanda baca / karakter non-alfanumerik (kecuali spasi)
 * - buang prefiks umum ("Kabupaten", "Kota", "Kecamatan", "Provinsi",
 *   "Daerah Istimewa", "Daerah Khusus", "DKI", "Ibukota", dst.)
 * - normalisasi spasi
 *
 * Contoh:
 *   "Kabupaten Sleman"                    -> "sleman"
 *   "Kota Yogyakarta"                     -> "yogyakarta"
 *   "Daerah Istimewa Yogyakarta"          -> "yogyakarta"
 *   "Kecamatan Umbulharjo"                -> "umbulharjo"
 *   "DI YOGYAKARTA"                       -> "yogyakarta"
 *   "Special Region of Yogyakarta" (Google)-> "yogyakarta"
 */
export function normalizeRegionName(value) {
    return String(value ?? '')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(
            /\b(kabupaten|kab|kecamatan|kec|kota|city|provinsi|prov|regency|district|daerah istimewa|daerah khusus|dki|ibukota|special region|special capital region|di|of)\b/g,
            ' ',
        )
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Cari opsi wilayah ({ id, name }) yang paling cocok dengan nilai teks dari
 * Google Maps / Nominatim.
 *
 * Prioritas:
 * 1. Nama persis setelah dinormalisasi.
 * 2. Saling mengandung (substring) — menangani perbedaan kecil ejaan/spasi.
 */
export function findRegionOption(options, value) {
    const target = normalizeRegionName(value);
    if (!target) return null;

    const exact = options.find((opt) => normalizeRegionName(opt.name) === target);
    if (exact) return exact;

    return (
        options.find((opt) => {
            const name = normalizeRegionName(opt.name);
            return name.length > 0 && (name.includes(target) || target.includes(name));
        }) ?? null
    );
}

/**
 * Ekstrak nama provinsi, kabupaten/kota, dan kecamatan dari array
 * `address_components` milik Google Maps Geocoding API.
 *
 * @param {Array<{ long_name: string, types: string[] }>} addressComponents
 * @returns {{ province: string, city: string, district: string }}
 */
export function extractRegionFromAddressComponents(addressComponents = []) {
    const getComponent = (type) =>
        addressComponents.find((component) => component.types.includes(type))?.long_name ?? '';

    const getFirstComponent = (...types) => {
        for (const type of types) {
            const value = getComponent(type);
            if (value) return value;
        }
        return '';
    };

    return {
        province: getComponent('administrative_area_level_1'),
        city: getFirstComponent('administrative_area_level_2', 'locality'),
        district: getFirstComponent(
            'administrative_area_level_3',
            'administrative_area_level_4',
            'sublocality_level_1',
            'sublocality',
        ),
    };
}
