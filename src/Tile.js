export default class Tile {
    constructor(prop) {
        this.coordX_ = prop.coord_x
        this.coordY_ = prop.coord_y
        this.x_ = prop.x
        this.y_ = prop.y
        this.nears_ = prop.nears || []

        this.grassLevel_ = prop.grass || 0
        this.nextState_ = prop.next_state || null
        this.content_ = {
            entry: null,
            base: null,
            exit: null,
            storage: 0
        }
    }

    get entryPoint_() {
        return this.content_.entry
    }
    get basePoint_() {
        return this.content_.base
    }
    get exitPoint_() {
        return this.content_.exit
    }
    get storage_() {
        return this.content_.storage
    }

    get color_() {
        // return ['#eeeeee', '#d9ead3', '#b6d7a8', '#93c47d', '#6aa84f', '#38761d'][this.grassLevel_]
        return ['#eeeeee', '#93c47d'][this.grassLevel_]
    }

    set entryPoint_(data) {
        this.content_.entry = !!this.content_.base && data !== null ? null : data
    }
    set basePoint_(data) {
        this.content_.base = !!this.content_.base && data !== null ? this.content_.base : data
    }
    set exitPoint_(data) {
        this.content_.exit = data
    }
    set storage_(data) {
        this.content_.storage += data
    }
    set grassUp_(data) {
        // console.log(data)
        const upd_grass = this.grassLevel_ + data
        if (upd_grass >= 0 && upd_grass <= 1) {
            this.grassLevel_ = upd_grass
        } else {
            this.grassLevel_ = upd_grass < 0 ? 0 : 1
        }
    }
    set grassUpd_(data) {
        this.grassLevel_ = data
        this.nextState_ = 0
    }
    set stateUpd_(data) {
        const upd_grass = this.grassLevel_ + data
        if (upd_grass >= 0 && upd_grass <= 1) {
            this.nextState_ = upd_grass
        } else {
            this.nextState_ = upd_grass < 0 ? 0 : 1
        }
    }
}