export function animation(params) {
    const { clear, update, render, canvasProp } = params
    let past_ts = 0

    requestAnimationFrame(tick)

    function tick(ts) {
        requestAnimationFrame(tick)

        const diff = ts - past_ts
        const fps = 1000 / diff
        const second_part = diff / 1000
        past_ts = ts

        const metrics = {
            diff,
            fps,
            second_part,
        }

        update(metrics)
        clear()
        render()
    }
}