import Field from "./Field";
import { animation } from "./animation";

const canvas = document.getElementById('c-world')
const canvasCtx = canvas.getContext('2d')
const canvasProp = {
    width: 180,
    height: 90,
    sq_size: 10,
    gap: 0
}
const px_width = canvasProp.width * canvasProp.sq_size + (canvasProp.width + 1) * canvasProp.gap
const px_height = canvasProp.height * canvasProp.sq_size + (canvasProp.height + 1) * canvasProp.gap

let fps_ui = 0
let sum_second = 0

canvas.width = px_width
canvas.height = px_height

const GameField = Field.init(canvasProp)

animation({
    clear() {
        canvasCtx.beginPath()
        canvasCtx.fillStyle = '#eeeeee'
        if (GameField.tileToRender_.size > 0) {
            canvasCtx.rect(
                0,
                0,
                px_width,
                px_height
            )
        }
        canvasCtx.fill()
    },
    update(metrics) {
        sum_second += metrics.second_part
        if (sum_second > .33) {
            if (fps_ui !== Math.floor(metrics.fps)) {
                fps_ui = Math.floor(metrics.fps)
            }
            document.getElementById('fps').innerText = fps_ui
            document.getElementById('lives').innerText = GameField.livesTile_
            sum_second = 0
            GameField.livesTile_ = 0
            for (const tile_uuid of GameField.tileToUpdate_) {
                if (GameField.tileGraph_.get(tile_uuid).grassLevel_ > 0) {
                    GameField.tileGraph_.get(tile_uuid).nears_.forEach(uuid => {
                        if (!!uuid) GameField.addToUpdate_ = uuid
                    })
                }

                GameField.tileGraph_.get(tile_uuid).stateUpd_ = GameField.step(GameField.tileGraph_.get(tile_uuid).nears_, tile_uuid) ? 1 : -1
                if (GameField.tileGraph_.get(tile_uuid).nextState_ === 1 || GameField.tileGraph_.get(tile_uuid).grassLevel_ === 1) {
                    GameField.addToRender_ = tile_uuid
                    GameField.livesTile_++
                }
            }
            GameField.tileToUpdate_.clear()
        }
    },
    render() {
        canvasCtx.beginPath()
        canvasCtx.fillStyle = '#93c47d'
        
        for (const tile_uuid of GameField.tileToRender_) {
            if (GameField.tileGraph_.get(tile_uuid).nextState_ !== null) {
                GameField.tileGraph_.get(tile_uuid).grassUpd_ = GameField.tileGraph_.get(tile_uuid).nextState_
            }
            if (GameField.tileGraph_.get(tile_uuid).grassLevel_ > 0) {
                canvasCtx.rect(
                    GameField.tileGraph_.get(tile_uuid).coordX_,
                    GameField.tileGraph_.get(tile_uuid).coordY_,
                    GameField.tileSize_,
                    GameField.tileSize_
                )
                GameField.addToUpdate_ = tile_uuid
            }
        }
        canvasCtx.fill()
        GameField.tileToRender_.clear()
    },
    canvasProp
})
