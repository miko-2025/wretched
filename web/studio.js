
class Studio extends EventSystem {
	constructor(){
		super();
		const element = this.element
			= document.createElement("div")
		;
		element.classList.add("studio");
		const control = document.createElement("div");
		control.classList.add("control");

		const canvas = this.canvas = document.createElement("canvas");
		const context = this.context = canvas.getContext("2d");
		context.strokeJoin = "round";
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		const brushControl = document.createElement("input");
		brushControl.setAttribute("type", "range");
		brushControl.classList.add("brush-size");
		brushControl.addEventListener("change", function(){
			context.lineWidth = brushControl.value;
		});

		const brushType = document.createElement("button");
		brushType.classList.add("control", "brush-type");
		brushType.addEventListener("click", function(){
			brushType.textContent
				= brushType.textContent == "Brush"
					? "Eraser"
					: "Brush"
				;
			context.globalCompositeOperation = context
				.globalCompositeOperation == "destination-out"
					? "source-over"
					: "destination-out"
				;
		});

		const coloris = document.createElement("input");
		coloris.classList.add("coloris");
		Coloris({ el: ".coloris", onChange: function(){
			context.strokeStyle
				= context.fillStyle
				= coloris.value
			;
		} });

		control.appendChild(brushControl);
		control.appendChild(brushType);
		control.appendChild(coloris);
		element.appendChild(control);
		element.appendChild(canvas);

		// :(
		const _ = canvas.addEventListener
			.bind(canvas)
		;

		let lastTouch = null;
		let f;
		_("touchmove", f = function(event){
			event.preventDefault();

			const [ touch ] = event.touches;
			if(!lastTouch){
				lastTouch = touch;
				return ;
			}

			if(lastTouch.id != touch.id)
				return ;

			const ltx = Math.round(lastTouch.clientX);
			const lty = Math.round(lastTouch.clientY)
			const x = Math.round(touch.clientX);
			const y = Math.round(touch.clientY)

			context.beginPath();
			context.moveTo(
				ltx,
				lty
			);
			/*context.arc(ltx, lty,
				context.lineWidth*0.05,
			0, 360);*/
			context.lineTo(
				x,
				y
			);
			context.stroke();
			context.beginPath();
			/*context.arc(x, y,
				context.lineWidth*0.5,
			0, 360);*/
			context.lineCap = "round";
			context.fill();

			lastTouch = touch;
		});

		_("touchstart", f);

		_("touchend", function(event){
			const touch = event;
			if(!lastTouch || lastTouch.id != touch.id)
				return ;

			lastTouch = null;
		})
	}
} // lowkey, saving animation would be difficult

Studio.prototype.append = function(target = document.body){
	target.appendChild(this.element);
}

let studio;
window.addEventListener("DOMContentLoaded", function(){
	if(document.body.classList.contains("no-studio"))
		return ;

	studio = new Studio();
	studio.append(document.body);
});
