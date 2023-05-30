export function logical_cpus() {
    const n_cpus = navigator?.hardwareConcurrency ?? 1;
    return n_cpus + n_cpus % 2;
}
