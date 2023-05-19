/* eslint @typescript-eslint/no-explicit-any: [off] */

import Chart from 'chart.js/auto';
import React, { useEffect, useRef } from 'react';
import { useIsFirstRender } from 'usehooks-ts';

import { ordinal } from '../../source/functions';
import { useMouseDragX } from '../../source/react';
import { Nft, NftIssue, NftLevel, Rates, Token } from '../../source/redux/types';
import { theme } from '../../source/theme';
import { normalize } from './tools/apr-normalize';
import { RateEvaluator } from './tools/rate-evaluator';

type Props = {
    level: NftLevel;
    issue: NftIssue;
    rates: Rates;
    token: Token;
}
export function UiCoverGraphChartLine(
    { level, issue, rates, token }: Props
) {
    const $ref = useRef<HTMLCanvasElement>(null);
    const animate = useIsFirstRender();
    const delta = BigInt(Math.round(
        useMouseDragX($ref)[0]
    ));
    useEffect(() => chart($ref, {
        level, issue, rates, token, animate, delta,
    }), [
        level, issue, rates, token, animate, delta,
    ]);
    return <div className='chart chart-line cover-layer'>
        <canvas ref={$ref} />
    </div>;
}
function chart(
    $ref: React.RefObject<HTMLCanvasElement>, {
        level, issue, rates, token, animate, delta,
    }: Props & {
        animate: boolean, delta: bigint
    }
) {
    if ($ref.current === null) {
        return;
    }
    const re = RateEvaluator(rates, token, issue, delta);
    const targets = re.targets.map((t) => scaleBy(t, level));
    const actuals = re.actuals.map((a) => scaleBy(a, level));
    const xp_color = style(theme(token).XP_POWERED);
    const xp_alpha = xp_color.replace(/1\)$/, '0.125)');
    const data = {
        labels: re.stamps,
        datasets: [{
            data: actuals,
            borderColor: xp_color,
            borderWidth: 2,
            label: 'Actual Rate',
            pointBackgroundColor: xp_color,
            pointRadius: ({ dataIndex: i }: any) => {
                if (typeof i === 'number' &&
                    re.stamps[i].getDate() === 1
                ) {
                    return 1;
                }
                return 0;
            },
            stepped: false,
        }, {
            data: targets,
            borderColor: xp_color,
            borderDash: [2, 4],
            borderWidth: 2,
            fill: {
                target: 'origin',
                above: xp_alpha,
                below: xp_alpha,
            },
            label: 'Target Rate',
            pointBackgroundColor: xp_color,
            pointRadius: 0,
            stepped: 'middle' as any,
        }]
    };
    const options = {
        animation: {
            duration: animate ? 600 : 0
        },
        layout: {
            padding: {
                right: 48
            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    labelColor: () => ({
                        backgroundColor: xp_color,
                        borderColor: xp_color,
                        borderRadius: 2,
                        borderWidth: 2,
                    }),
                    label: (ctx: any) => {
                        const label = ctx.dataset.label || '';
                        const value = ctx.parsed.y.toFixed(2);
                        return ` ${label}: ${value}%`;
                    },
                    title: ([{ dataIndex: i }]: any) => {
                        const dtf = new Intl.DateTimeFormat('en-US', {
                            day: 'numeric', month: 'long', year: '2-digit',
                        });
                        const fmt = Object.fromEntries(
                            dtf.formatToParts(re.stamps[i]).map(
                                ({ type: t, value: v }) => [t, v]
                            )
                        );
                        const [d, m, y] = [
                            ordinal(fmt['day']), fmt['month'], fmt['year']
                        ]
                        return `${d} of ${m} '${y}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: xp_color,
                    lineWidth: 0.125,
                    tickBorderDash: [1]
                },
                ticks: {
                    callback: (i: any) => {
                        if (re.stamps[i].getDate() === 1) {
                            const dtf = new Intl.DateTimeFormat('en-US', {
                                month: 'short', year: '2-digit'
                            });
                            const fmt = Object.fromEntries(
                                dtf.formatToParts(re.stamps[i]).map(
                                    ({ type: t, value: v }) => [t, v]
                                )
                            );
                            if (re.stamps[i].getMonth() === 0) {
                                return `${fmt['month']}'${fmt['year']}`;
                            }
                            return fmt['month'];
                        }
                        return null;
                    },
                    maxRotation: 0
                },
            },
            y: {
                grid: {
                    color: xp_color,
                    lineWidth: 0.125,
                    tickBorderDash: [1],
                },
                ticks: {
                    callback: (v: string | number) => {
                        return `${Number(v).toFixed(2)}%`;
                    }
                },
                title: {
                    display: true,
                    text: `${Nft.nameOf(level)} Rewards '${issue % 100}`,
                },
                max: max(
                    targets.concat(actuals), level
                ),
                suggestedMin: min(
                    targets.concat(actuals), level
                ),
            },
        },
        maintainAspectRatio: false,
    };
    Chart.defaults.font.size = 10;
    Chart.defaults.color = xp_color;
    const chart = new Chart($ref.current, {
        type: 'line', data, options
    });
    return () => chart.destroy();
}
function max(
    values: number[], _level: NftLevel
) {
    const max = Math.max(...values);
    return max > 0 ? 1.01 * max : 1;
}
function min(
    _values: number[], _level: NftLevel
) {
    return 0;
}
function scaleBy(
    [apr, apb]: [bigint, bigint], level: NftLevel
) {
    return normalize(apr * BigInt(level) / 3n + apb);
}
function style(
    name: string
) {
    const styles = getComputedStyle(document.body);
    return styles.getPropertyValue(name).trim();
}
export default UiCoverGraphChartLine;
