"use strict"

window.Spectrum = class Spectrum {
	constructor () {
        //super();
		this._audioContext = null
		this._audioInput = null
		this._inputPoint = null;
		
		this._analyserContext = null;
		this._fftSize = 128 //2048 // needs to be power of 2, and larger than 32?
        this._gain = 1
		this._gainTweak = 0

		return this
    }

	setupIfNeeded () {
		// Can't init audio until user has clicked the mouse or typed on the keyboard
		// so don't call this until then
		
		if (!this._audioContext) {
			this._audioContext = new AudioContext();

			navigator.mediaDevices.getUserMedia({ audio: true }).then(
				(stream) => { this.onStreamOpen(stream) }).catch(
			    (error) => { this.onStreamError(error) }
		   )
		}
	}

	onStreamOpen (stream) {
		this._inputPoint = this._audioContext.createGain(); // needed?

		// Create an AudioNode from the stream.
		this._audioInput = this._audioContext.createMediaStreamSource(stream);
		this._audioInput.connect(this._inputPoint);

		// setup frequency analyser
		this._analyserNode = this._audioContext.createAnalyser();
		this._analyserNode.fftSize = this._fftSize;
		this._inputPoint.connect(this._analyserNode);

		this._freqByteData = new Uint8Array(this._analyserNode.frequencyBinCount);

		this._bins = []
		for (let i = 0; i < this._analyserNode.frequencyBinCount; i++) {
			this._bins.push(0)
		}

		/*
		zeroGain = this._audioContext.createGain();
		zeroGain.gain.value = 0.0;
		this._inputPoint.connect(zeroGain);
		zeroGain.connect(this._audioContext.destination);
		*/
		//this.timeStep();
	}

	onStreamError (error) {
		alert("Spectrum class: error getting audio input");
		console.log(error);
	}

	getBins () {
		if (this._analyserNode == null) { 
			return null 
		}

		//const freqByteData = new Uint8Array(this._analyserNode.frequencyBinCount);
		//this._analyserNode.getByteFrequencyData(freqByteData);
		this._analyserNode.getByteFrequencyData(this._freqByteData);

		for (let i = 0; i < this._analyserNode.frequencyBinCount; i++) {
			this._bins[i] = this._freqByteData[i] //* (this._gain + this._gainTweak)
		}

		return this._bins
	}

}
