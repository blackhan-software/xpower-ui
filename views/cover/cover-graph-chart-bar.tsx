/* eslint @typescript-eslint/no-explicit-any: [off] */

import Chart from 'chart.js/auto';
import React, { useEffect, useRef } from 'react';
import { useIsFirstRender } from 'usehooks-ts';

import { range } from '../../source/functions';
import { ROParams } from '../../source/params';
import { Nft, NftIssue, NftLevel, Rates, Token } from '../../source/redux/types';
import { theme } from '../../source/theme';
import { normalize } from './tools/apr-normalize';
import { RateEvaluator } from './tools/rate-evaluator';

type Props = {
    issue: NftIssue;
    rates: Rates;
    token: Token;
}
export function UiCoverGraphChartBar(
    { issue, rates, token }: Props
) {
    const $ref = useRef<HTMLCanvasElement>(null);
    const animate = useIsFirstRender();
    useEffect(() => chart($ref, {
        animate, issue, rates, token
    }), [
        animate, issue, rates, token
    ]);
    return <div className='chart chart-bar cover-layer'>
        <canvas ref={$ref} />
    </div>;
}
function chart(
    $ref: React.RefObject<HTMLCanvasElement>, {
        animate, issue, rates, token
    }: Props & {
        animate: boolean
    }
) {
    if ($ref.current === null) {
        return;
    }
    const { min, max } = ROParams.nftLevel;
    const levels = Array.from(range(min, max + 3, 3));
    const labels = levels.map((l) => Nft.nameOf(l))
    const re = RateEvaluator(rates, token, issue);
    const target = middle(re.targets) ?? [0n, 0n];
    const targets = levels.map((l) => scaleBy(target, l));
    const actual = middle(re.actuals) ?? [0n, 0n];
    const actuals = levels.map((l) => scaleBy(actual, l));
    const xp_color = style(theme(token).XP_POWERED);
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
                        const value = ctx.parsed.y.toFixed(2);
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
                    callback: (v: string | number) => `${Number(v).toFixed(2)}%`
                },
                title: {
                    display: true,
                    text: `NFT Rewards '${issue % 100}`,
                },
            },
        },
        maintainAspectRatio: false,
    }
    Chart.defaults.font.size = 10;
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
export default UiCoverGraphChartBar;
