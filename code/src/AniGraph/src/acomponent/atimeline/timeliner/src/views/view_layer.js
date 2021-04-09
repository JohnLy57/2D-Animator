import { Theme } from '../theme.js'
import { UINumber } from '../ui/ui_number.js'
import { Tweens } from '../utils/util_tween.js'
import { LayoutConstants } from '../layout_constants.js'
import { utils } from '../utils/utils.js'
;

var TweensToUse = Tweens;

const SHOWVALUENUM=false;
const SOLOBUTTON = false;
const MUTEBUTTON = false;

// TODO - tagged by index instead, work off layers.

function LayerView(layer, dispatcher) {
	var dom = document.createElement('div');

	var label = document.createElement('span');

	label.style.cssText = 'font-size: 12px; padding: 4px;';

	label.addEventListener('click', function(e) {
		// context.dispatcher.fire('label', channelName);
	});

	label.addEventListener('mouseover', function(e) {
		// context.dispatcher.fire('label', channelName);
	});

	var dropdown = document.createElement('select');
	var option;
	dropdown.style.cssText = 'font-size: 10px; width: 60px; margin: 0; float: right; text-align: right;';

	for (var k in TweensToUse) {
		option = document.createElement('option');
		option.text = k;
		dropdown.appendChild(option);
	}

	dropdown.addEventListener('change', function(e) {
		dispatcher.fire('ease', layer, dropdown.value);
	});
	var height = (LayoutConstants.LINE_HEIGHT - 1);

	var keyframe_button = document.createElement('button');
	keyframe_button.innerHTML = '&#9672;'; // '&diams;' &#9671; 9679 9670 9672
	keyframe_button.style.cssText = 'background: none; font-size: 12px; padding: 0px; font-family: monospace; float: right; width: 20px; height: ' + height + 'px; border-style:none; outline: none;'; //  border-style:inset;

	keyframe_button.addEventListener('click', function(e) {
		// console.log('clicked:keyframing...', state.get('_value').value);
		dispatcher.fire('keyframe', layer, state.get('_value').value);
	});


	// Prev Keyframe
	var previous_keyframe_button = document.createElement('button');
	previous_keyframe_button.textContent = '<';
	previous_keyframe_button.style.cssText = 'font-size: 12px; padding: 1px; ';
	dom.appendChild(previous_keyframe_button);
	previous_keyframe_button.addEventListener('click', function(e) {
		dispatcher.fire('keyframe.previous', layer, state.get('_value').value);
	});


	// Next Keyframe
	var next_keyframe_button = document.createElement('button');
	next_keyframe_button.textContent = '>';
	next_keyframe_button.style.cssText = 'font-size: 12px; padding: 1px; ';
	dom.appendChild(next_keyframe_button);
	next_keyframe_button.addEventListener('click', function(e) {
		dispatcher.fire('keyframe.next', layer, state.get('_value').value);
	});
	//

	function ToggleButton(text) {
		// for css based button see http://codepen.io/mallendeo/pen/eLIiG

		var button = document.createElement('button');
		button.textContent = text;

		utils.style(button, {
			fontSize: '12px',
			padding: '1px',
			borderSize: '2px',
			outline: 'none',
			background: Theme.a,
			color: Theme.c,
		});

		this.pressed = false;

		button.onclick = () => {
			this.pressed = !this.pressed;

			utils.style(button, {
				borderStyle: this.pressed ? 'inset' : 'outset', // inset outset groove ridge
			})

			if (this.onClick) this.onClick();
		};

		this.dom = button;

	}

	// Solo
	if(SOLOBUTTON) {
		var solo_toggle = new ToggleButton('S');
		dom.appendChild(solo_toggle.dom);
		solo_toggle.onClick = function () {
			dispatcher.fire('action:solo', layer, solo_toggle.pressed);
		}
	}

	// Mute
	if(MUTEBUTTON) {
		var mute_toggle = new ToggleButton('M');
		dom.appendChild(mute_toggle.dom);

		mute_toggle.onClick = function () {
			dispatcher.fire('action:mute', layer, mute_toggle.pressed);
		}
	}

	dom.appendChild(label);

	var dup_keyframe_button = document.createElement('button');
	dup_keyframe_button.textContent = '|D';
	dup_keyframe_button.style.cssText = 'font-size: 12px; padding: 1px; ';
	dom.appendChild(dup_keyframe_button);
	dup_keyframe_button.addEventListener('click', function(e) {
		dispatcher.fire('keyframe.dup', layer, state.get('_value').value);
	});

	dom.appendChild(keyframe_button);

	if(SHOWVALUENUM) {
		var number = new UINumber(layer, dispatcher);
		number.onChange.do(function(value, done) {
			state.get('_value').value = value;
			dispatcher.fire('value.change', layer, value, done);
		});
		utils.style(number.dom, {
			float: 'right'
		});
		dom.appendChild(number.dom);
	}
	dom.appendChild(dropdown);

	utils.style(dom, {
		textAlign: 'left',
		margin: '0px 0px 0px 5px',
		borderBottom: '1px solid ' + Theme.b,
		top: 0,
		left: 0,
		height: (LayoutConstants.LINE_HEIGHT - 1 ) + 'px',
		color: Theme.c
	});

	this.dom = dom;

	this.repaint = repaint;
	var state;

	this.setState = function(l, s) {
		layer = l;
		state = s;

		if(SHOWVALUENUM){
			var tmp_value = state.get('_value');
			if (tmp_value.value === undefined) {
				tmp_value.value = 0;
			}


			number.setValue(tmp_value.value);
		}
		label.textContent = state.get('_name').value;

		repaint();
	};

	function repaint(s) {

		dropdown.style.opacity = 0;
		dropdown.disabled = true;
		keyframe_button.style.color = Theme.b;
		// keyframe_button.disabled = false;
		// keyframe_button.style.borderStyle = 'solid';

		var tween = null;
		var o = utils.layerPropInfoAtTime(layer, s);

		if (!o) return;

		if (o.can_tween) {
			dropdown.style.opacity = 1;
			dropdown.disabled = false;
			// if (o.tween)
			dropdown.value = o.tween ? o.tween : 'none';
			if (dropdown.value === 'none') dropdown.style.opacity = 0.5;
		}

		if (o.keyframe) {
			keyframe_button.style.color = Theme.c;
			// keyframe_button.disabled = true;
			// keyframe_button.style.borderStyle = 'inset';
		}

		state.get('_value').value = o.value;
		if(SHOWVALUENUM) {
			number.setValue(o.value);
			number.paint();
		}
		// dispatcher.fire('target.notify', layer.name, o.value);
	}

}

export { LayerView }
