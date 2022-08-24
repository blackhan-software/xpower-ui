export function link({
    crossOrigin, integrity, href, rel, el
}: Partial<{
    crossOrigin: string;
    integrity: string;
    href: string;
    rel: string;
    el: Element;
}> = {}) {
    const element = el ?? document.head;
    const link = element.querySelector<HTMLLinkElement>(
        `[href='${href}']`
    );
    if (link) {
        return Promise.resolve(link);
    }
    return new Promise<HTMLLinkElement>((
        resolve, reject
    ) => {
        const link = document.createElement(
            'link'
        );
        if (crossOrigin) {
            link.crossOrigin = crossOrigin;
        }
        if (integrity) {
            link.integrity = integrity;
        }
        if (href) {
            link.href = href;
        }
        if (rel) {
            link.rel = rel;
        }
        link.onload = () => {
            resolve(link);
        };
        link.onerror = () => {
            element.removeChild(link);
            reject(link);
        };
        element.appendChild(link);
    });
}
export function script({
    crossOrigin, integrity, src, el
}: Partial<{
    crossOrigin: string;
    integrity: string;
    src: string;
    el: Element;
}> = {}) {
    const element = el ?? document.head;
    const script = element.querySelector<HTMLScriptElement>(
        `[src='${src}']`
    );
    if (script) {
        return Promise.resolve(script);
    }
    return new Promise<HTMLScriptElement>((
        resolve, reject
    ) => {
        const script = document.createElement(
            'script'
        );
        if (src) {
            script.src = src;
        }
        if (integrity) {
            script.integrity = integrity;
        }
        if (crossOrigin) {
            script.crossOrigin = crossOrigin;
        }
        script.onload = () => {
            resolve(script);
        };
        script.onerror = () => {
            element.removeChild(script);
            reject(script);
        };
        element.appendChild(script);
    });
}
