import Tile from "./Tile"

export default class Field {
	constructor(data) {
		this.width_ = data.width
		this.height_ = data.height
		this.tileSize_ = data.sq_size
		this.gapSize_ = data.gap

		this.tileGraph_ = new Map()
		this.tileToUpdate_ = new Set()
		this.tileToRender_ = new Set()

		this.livesTile_ = 0
	}

	static init(props) {
		const game_field = new Field(props)
		game_field.fillFieldGrid()
		return game_field
	}

	set addToUpdate_(tile_uuid) {
		this.tileToUpdate_.add(tile_uuid)
	}
	set deleteToUpdate_(tile_uuid) {
		this.tileToUpdate_.delete(tile_uuid)
	}
	set addToRender_(tile_uuid) {
		this.tileToRender_.add(tile_uuid)
	}
	set deleteToRender_(tile_uuid) {
		this.tileToRender_.delete(tile_uuid)
	}

	fillFieldGrid() {
		let cofx = 0.6, k = 1
		for (let i = 0; i < this.width_; i++) {
			const near_left = i > 0 ? i - 1 : this.width_ - 1
			const near_right = i < this.width_ - 1 ? i + 1 : 0
			for (let j = 0; j < this.height_; j++) {
				const tile_uuid = `x${i}_y${j}`
				const near_top = j > 0 ? j - 1 : this.height_ - 1
				const near_bottom = j < this.height_ - 1 ? j + 1 : 0
				this.tileGraph_.set(
					tile_uuid,
					new Tile({
						x: i,
						y: j,
						coord_x: this.gapSize_ * (i + 1) + this.tileSize_ * i,
						coord_y: this.gapSize_ * (j + 1) + this.tileSize_ * j,
						grass: Math.round(Math.random() * cofx),
						nears: [
							`x${i}_y${near_top}`,
							`x${near_right}_y${near_top}`,
							`x${near_right}_y${j}`,
							`x${near_right}_y${near_bottom}`,
							`x${i}_y${near_bottom}`,
							`x${near_left}_y${near_bottom}`,
							`x${near_left}_y${j}`,
							`x${near_left}_y${near_top}`,
						],
						next_state: null
					})
				)
				this.tileToRender_.add(tile_uuid)
			}

		}
		let count = 0
		this.tileGraph_.forEach(tile => {
			if (tile.grassLevel_ > 0) ++count
		})
	}

	step(uuids, target_uuid) {
		let count = 0
		uuids.forEach(uuid => {
			if (!!uuid) this.tileGraph_.get(uuid).grassLevel_ > 0 && ++count
		})
		if (this.tileGraph_.get(target_uuid).grassLevel_ === 0) {
			return count === 3 ? true : false
		}
		return count >= 2 && count <= 3 ? true : false
	}
}
