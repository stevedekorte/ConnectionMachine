class HtmlDisplay {
	constructor () {
		this._element = document.getElementById("HtmlDisplay")
		this._element.className = "HtmlDisplay"

		this._frame = new LedFrame()
		this._delegate = null
		this._rows = []
		this._brightness = 1
		this.registerForResize()
	}

	setDelegate (obj) {
		this._delegate = obj
		return this
	}

	frame () {
		return this._frame
	}

	setup () {
		const xmax = this.frame().width()
		const ymax = this.frame().height()
		for (let y = 0; y < ymax; y++) {
			const rowArray = []
			this._rows.push(rowArray)
			const row = document.createElement("div");
			row.style.width = "fit-content"
			row.style.display = "pre"
			row.style.whiteSpace = "nowrap"
			row.className = "row"
			row.style.margin = "0px"
			row.style.padding = "0px"
			for (let x = 0; x < xmax; x++) {
				const item = document.createElement("div");
				item.className = "item"
				item.innerHTML = "&#11044;"
				item.style.display = "inline-block"
				item.style.margin = "0px"
				item.style.padding = "0px"
				item.style.color = "#ff0000"
				//item.style.transition = "all 0s"
				//item.innerHTML = x + "." + y
				row.appendChild(item)
				rowArray.push(item)
			}
			this._element.appendChild(row)
		}
		this.setBrightness(1)
		this.render()
	}


	elementAtXY (x, y) {
		return this._rows[y][x]
	}

	render () {
		const min = 0.8
		this._element.style.opacity =  min + (this._brightness/15)*(1 - min)

		const xmax = this.frame().width()
		const ymax = this.frame().height()
		for (let y = 0; y < ymax; y++) {
			for (let x = 0; x < xmax; x++) {
				const item = this.elementAtXY(x, y)
				const v = this.frame().getBit(x, y)
				if (v === 1) {
					item.style.color = "#ff0000"
					//item.style.opacity = min + (this._brightness/15)*(1 - min)
				} else {
					item.style.color = "#440000"
					//item.style.opacity = 0.1
				}
			}
		}
	}

	clear () {
		this.frame().clear()
		this.render()
	}

	setBrightness (v) { // max is 15
		v = Math.round(v)
		if (v > 15) { v = 15 }
		if (v < 0) { v = 0 }
		this._brightness = v
		return this
	}

	brightness () {
		return this._brightness
	}

	log (msg) {
		const content = document.getElementById("content")
		content.innerHTML += " " + msg + "\n"
	}

	step () {
		this._frame.randomize()
		this.render()
	}

	registerForResize () {
		window.addEventListener('resize', (event) => {
			this.onWindowResize(event)
		}, true);
	}

	onWindowResize (event) {
		this.layout()
	}
	
	layout () {
		const marginRatio = 0.1

		const xmax = this.frame().width() 
		const ymax = this.frame().height()

		const items = this._rows.flat()
		const w = window.innerWidth
		const h = window.innerHeight

		const smallerDim = (w > h) ? h : w;
		const itemSize = (smallerDim*(1- marginRatio*2)/xmax) 
		
		const margin = smallerDim * marginRatio

		items.forEach((item) => {
			item.style.width = itemSize  + "px"
			item.style.maxWidth = itemSize  + "px"
			item.style.height = itemSize  + "px"
			item.style.maxHeight = itemSize  + "px"
			item.style.fontSize = Math.floor(itemSize*0.3) + "px"
		})

		//this._element.style.margin = Math.floor(margin) + "px"
		//this._element.style.marginTop = Math.floor(margin/2) + "px"
		//this._element.style.marginBottom = Math.floor(margin/2) + "px"
		const dw = (xmax * itemSize)
		const dh = (ymax * itemSize)
		this._element.style.width = dw + "px"
		this._element.style.height = dh + "px"
		this._element.style.position = "fixed"
		const dx = (w/2 - dw/2) 
		const dy = (h/2 - dh/2)
		this._element.style.left = dx + "px"
		//this._element.style.right = dx + "px"
		//this._element.style.top = dy + "px"
		this._element.style.bottom = dy + "px"
	}
}

