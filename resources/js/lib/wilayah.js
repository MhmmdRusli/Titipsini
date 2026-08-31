
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
 * Catatan penting: Google Maps sering TIDAK punya boundary resmi untuk
 * level kecamatan di Indonesia (administrative_area_level_3 sering kosong).
 * Jadi kita coba beberapa fallback berurutan, dan sebagai upaya terakhir
 * pakai locality/administrative_area_level_2 yang paling mendekati kecamatan.
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
            'locality',
            'administrative_area_level_2',
        ),
    };
}