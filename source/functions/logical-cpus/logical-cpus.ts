export function logical_cpus() {
    if (typeof navigator !== 'undefined') {
        const n_cpus = navigator?.hardwareConcurrency ?? 1;
        return n_cpus + n_cpus % 2;
    }
    return 1;
}
