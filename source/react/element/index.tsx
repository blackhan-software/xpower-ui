import React from 'react';

function enrich<
    A extends React.HTMLAttributes<E>,
    E extends HTMLElement
>(
    props: React.DetailedHTMLProps<A, E>
) {
    if (props.title) return {
        'aria-label': props.title,
        'data-bs-placement': 'top',
        'data-bs-toggle': 'tooltip',
        'data-bs-original-title': props.title,
        ...props
    };
    return props;
}
export const A = React.forwardRef(<
    A extends React.AnchorHTMLAttributes<E>,
    E extends HTMLAnchorElement
>(
    props: React.DetailedHTMLProps<A, E>,
    ref: React.ForwardedRef<E>
) => {
    return <a
        ref={ref} {...enrich(props)}
    >
        {props.children}
    </a>;
});
export const Button = React.forwardRef(<
    A extends React.ButtonHTMLAttributes<E>,
    E extends HTMLButtonElement
>(
    props: React.DetailedHTMLProps<A, E>,
    ref: React.ForwardedRef<E>
) => {
    return <button
        ref={ref} type='button' {...enrich(props)}
    >
        {props.children}
    </button>;
});
export const Div = React.forwardRef(<
    A extends React.HTMLAttributes<E>,
    E extends HTMLDivElement
>(
    props: React.DetailedHTMLProps<A, E>,
    ref: React.ForwardedRef<E>
) => {
    return <div
        ref={ref} {...enrich(props)}
    >
        {props.children}
    </div>;
});
export const Input = React.forwardRef(<
    A extends React.InputHTMLAttributes<E>,
    E extends HTMLInputElement
>(
    props: React.DetailedHTMLProps<A, E>,
    ref: React.ForwardedRef<E>
) => {
    return <input
        ref={ref} type='text' {...enrich(props)}
    >
        {props.children}
    </input>;
});
export const Img = React.forwardRef(<
    A extends React.ImgHTMLAttributes<E>,
    E extends HTMLImageElement
>(
    props: React.DetailedHTMLProps<A, E>,
    ref: React.ForwardedRef<E>
) => {
    return <img
        ref={ref} {...enrich(props)}
    >
        {props.children}
    </img>;
});
export const Li = React.forwardRef(<
    A extends React.LiHTMLAttributes<E>,
    E extends HTMLLIElement
>(
    props: React.DetailedHTMLProps<A, E>,
    ref: React.ForwardedRef<E>
) => {
    return <li
        ref={ref} {...enrich(props)}
    >
        {props.children}
    </li>;
});
export const Nav = React.forwardRef(<
    A extends React.HTMLAttributes<E>,
    E extends HTMLElement
>(
    props: React.DetailedHTMLProps<A, E>,
    ref: React.ForwardedRef<E>
) => {
    return <nav
        ref={ref} {...enrich(props)}
    >
        {props.children}
    </nav>;
});
export const Select = React.forwardRef(<
    A extends React.SelectHTMLAttributes<E>,
    E extends HTMLSelectElement
>(
    props: React.DetailedHTMLProps<A, E>,
    ref: React.ForwardedRef<E>
) => {
    return <select
        ref={ref} type='text' {...enrich(props)}
    >
        {props.children}
    </select>;
});
export const Span = React.forwardRef(<
    A extends React.HTMLAttributes<E>,
    E extends HTMLSpanElement
>(
    props: React.DetailedHTMLProps<A, E>,
    ref: React.ForwardedRef<E>
) => {
    return <span
        ref={ref} {...enrich(props)}
    >
        {props.children}
    </span>;
});
export const Ul = React.forwardRef(<
    A extends React.HTMLAttributes<E>,
    E extends HTMLUListElement
>(
    props: React.DetailedHTMLProps<A, E>,
    ref: React.ForwardedRef<E>
) => {
    return <ul
        ref={ref} {...enrich(props)}
    >
        {props.children}
    </ul>;
});
A.displayName = 'A';
Button.displayName = 'Button';
Div.displayName = 'Div';
Input.displayName = 'Input';
Img.displayName = 'Img';
Li.displayName = 'Li';
Nav.displayName = 'Nav';
Select.displayName = 'Select';
Span.displayName = 'Span';
Ul.displayName = 'Ul';
