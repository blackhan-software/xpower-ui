/* eslint @typescript-eslint/no-explicit-any: [off] */

import Chart from 'chart.js/auto';
import React, { useEffect, useRef } from 'react';
import { useIsFirstRender } from 'usehooks-ts';

import { mobile, nice, nice_si, range } from '../../source/functions';
import { ROParams } from '../../source/params';
import { Nft, NftIssue, NftLevel, Rates } from '../../source/redux/types';
import { theme } from '../../source/theme';
import { normalize } from './tools/apr-normalize';
import { RateEvaluator } from './tools/rate-evaluator';

import { Scale } from './cover-graph-chart-scale';
export { Scale };

type Props = {
    issue: NftIssue;
    rates: Rates;
    scale: Scale;
}
export function UiCoverGraphChartBar(
    { issue, rates, scale }: Props
) {
    const $ref = useRef<HTMLCanvasElement>(null);
    const animate = useIsFirstRender();
    useEffect(() => chart($ref, {
        animate, issue, rates, scale
    }), [
        animate, issue, rates, scale
    ]);
    return <div className='chart chart-bar cover-layer'>
        <canvas ref={$ref} />
    </div>;
}
function chart(
    $ref: React.RefObject<HTMLCanvasElement>, {
        animate, issue, rates, scale
    }: Props & {
        animate: boolean
    }
) {
    if ($ref.current === null) {
        return;
    }
    const { min, max } = ROParams.nftLevel;
    const levels = Array.from<NftLevel>(range(min, max + 3, 3));
    const labels = levels.map((l) => Nft.nameOf(l))
    const evaluators = levels
        .map(level => RateEvaluator(rates, level, issue));
    const targets = evaluators
        .map((re) => middle(re.targets) ?? [0n, 0n])
        .map(([apr, apb]) => normalize(apr + apb));
    const actuals = evaluators
        .map((re) => middle(re.actuals) ?? [0n, 0n])
        .map(([apr, apb]) => normalize(apr + apb));
    const xp_color = style(theme(ROParams.color).XP_POWERED);
    const xp_alpha = xp_color.replace(/1\)$/, '0.125)');
    const data = {
        labels,
        datasets: [{
            data: actuals,
            borderColor: xp_color,
            borderRadius: 2,
            borderWidth: 2,
            hoverBackgroundColor: xp_color,
            label: 'Actual Rate',
        }, {
            data: targets,
            backgroundColor: xp_alpha,
            borderColor: xp_color,
            borderRadius: 2,
            borderWidth: 2,
            hoverBackgroundColor: xp_color,
            label: 'Target Rate',
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
                        const value = nice(ctx.parsed.y ?? 0, {
                            maxPrecision: 2, minPrecision: 2
                        });
                        return ` ${label}: ${value}%`;
                    },
                    title: ([{ dataIndex: i }]: any) => {
                        return `${labels[i]} NFTs '${issue % 100}`;
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
                    maxRotation: 0
                },
                stacked: true,
            },
            y: {
                grid: {
                    color: xp_color,
                    lineWidth: 0.125,
                    tickBorderDash: [1],
                },
                ticks: {
                    callback: (v: string | number) => {
                        return nice_si(Number(v), {
                            maxPrecision: 2, minPrecision: 2
                        }) + '%';
                    }
                },
                title: {
                    display: true,
                    text: `NFT Rewards '${issue % 100}`,
                },
                type: scale,
            },
        },
        maintainAspectRatio: false,
    }
    Chart.defaults.font.size = mobile() ? 8 : 10;
    Chart.defaults.color = xp_color;
    const chart = new Chart($ref.current, {
        type: 'bar', data, options
    });
    return () => chart.destroy();
}
function middle<T>(
    array: Array<T>
): T | undefined {
    return array[Math.floor(array.length / 2)];
}
function style(
    name: string
) {
    const styles = getComputedStyle(document.body);
    return styles.getPropertyValue(name).trim();
}
export default UiCoverGraphChartBar;
