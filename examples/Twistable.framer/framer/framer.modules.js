require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Twistable":[function(require,module,exports){
var normalizeAngle, shortestDistanceBetweenAngles;

Layer.prototype.enableTwistable = function(range, constrained) {
  var handleSpinning, handleTouchEnd, handleTouchMove;
  this.canvasPinLocation = null;
  this.previousAngle = 0;
  this.angularVel = 0;
  this.twistRange = range || [0, 360];
  this.twistValue = 0;
  this.twistConstrained = constrained || range !== void 0;
  this.spinDecay = 0.95;
  handleTouchMove = (function(_this) {
    return function(e) {
      var angleDif, constrainedRotation, newAngle, newAngleDeg, newAngleDegUpIsZero;
      newAngle = Math.atan2(_this.canvasPinLocation.y - e.pageY, _this.canvasPinLocation.x - e.pageX);
      newAngleDeg = newAngle / Math.PI * 180;
      newAngleDegUpIsZero = newAngleDeg - 90;
      angleDif = shortestDistanceBetweenAngles(_this.previousAngle, newAngleDegUpIsZero);
      _this.rotation += angleDif;
      _this.angularVel = angleDif;
      if (_this.twistConstrained) {
        constrainedRotation = Math.min(Math.max(_this.rotation, _this.twistRange[0]), _this.twistRange[1]);
        if (_this.rotation !== constrainedRotation) {
          _this.angularVel = 0;
          _this.rotation = constrainedRotation;
        }
      }
      if (!_this.hasTwistBegan && _this.angularVel !== 0) {
        _this.hasTwistBegan = true;
        _this.emit("twistStart");
      }
      _this.previousAngle = newAngleDegUpIsZero;
      _this.twistValue = Utils.modulate(_this.rotation, _this.twistRange, [0, 1]);
      return _this.emit("twist");
    };
  })(this);
  handleSpinning = (function(_this) {
    return function(e) {
      var angularVel, constrainedRotation;
      _this.rotation += _this.angularVel;
      _this.angularVel *= _this.spinDecay;
      if (_this.twistConstrained) {
        constrainedRotation = Math.min(Math.max(_this.rotation, _this.twistRange[0]), _this.twistRange[1]);
        if (_this.rotation !== constrainedRotation) {
          _this.angularVel = 0;
          _this.rotation = constrainedRotation;
        }
      }
      _this.twistValue = Utils.modulate(_this.rotation, _this.twistRange, [0, 1]);
      _this.emit("spin");
      if (Math.abs(angularVel) < 0.1) {
        angularVel = 0;
        _this.emit("spinEnd");
        return Framer.Loop.off("update", handleSpinning);
      }
    };
  })(this);
  handleTouchEnd = (function(_this) {
    return function() {
      _this.isBeingTwisted = false;
      _this.emit("twistEnd");
      Events.wrap(document).removeEventListener("touchmove", handleTouchMove);
      Events.wrap(document).removeEventListener("touchend", handleTouchEnd);
      return Framer.Loop.on("update", handleSpinning);
    };
  })(this);
  this.onTouchStart((function(_this) {
    return function(e) {
      var localPinLocation, startAngle, startAngleDeg, startAngleDegUpIsZero;
      localPinLocation = {
        x: _this.width * _this.originX,
        y: _this.height * _this.originY
      };
      _this.canvasPinLocation = _this.convertPointToCanvas(localPinLocation);
      startAngle = Math.atan2(_this.canvasPinLocation.y - e.pageY, _this.canvasPinLocation.x - e.pageX);
      startAngleDeg = startAngle / Math.PI * 180;
      startAngleDegUpIsZero = startAngleDeg - 90;
      _this.previousAngle = startAngleDegUpIsZero;
      _this.rotationTouchPoint = {
        x: e.pageX,
        y: e.pageY
      };
      _this.hasTwistBegan = false;
      _this.isBeingTwisted = true;
      Events.wrap(document).addEventListener("touchmove", handleTouchMove);
      Events.wrap(document).addEventListener("touchend", handleTouchEnd);
      return Framer.Loop.off("update", handleSpinning);
    };
  })(this));
  return this.setTwistValue = (function(_this) {
    return function(v) {
      _this.twistValue = Math.max(Math.min(v, 1), 0);
      _this.rotation = Utils.modulate(v, [0, 1], _this.twistRange);
      return _this.emit("twist");
    };
  })(this);
};

Layer.prototype.disableTwistable = function() {
  return print("NOT WORKING YET");
};

Layer.prototype.onTwist = function(fn) {
  return this.on("twist", fn);
};

Layer.prototype.onTwistStart = function(fn) {
  return this.on("twistStart", fn);
};

Layer.prototype.onTwistEnd = function(fn) {
  return this.on("twistEnd", fn);
};

Layer.prototype.onSpin = function(fn) {
  return this.on("spin", fn);
};

Layer.prototype.onSpinEnd = function(fn) {
  return this.on("spinEnd", fn);
};

normalizeAngle = function(a) {
  return (a + 360 * 10000) % 360;
};

shortestDistanceBetweenAngles = function(a1, a2) {
  var a1Norm, a2Norm, r1;
  a1Norm = normalizeAngle(a1);
  a2Norm = normalizeAngle(a2);
  r1 = a2Norm - a1Norm;
  if (Math.abs(r1) > 180) {
    if (r1 > 0) {
      return r1 - 360;
    } else {
      return r1 + 360;
    }
  } else {
    return r1;
  }
};


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1VzZXJzL2lhbmJlbGxvbXkvRG9jdW1lbnRzL0dpdEh1Yi9Ud2lzdGFibGUvZXhhbXBsZXMvVHdpc3RhYmxlLmZyYW1lci9tb2R1bGVzL1R3aXN0YWJsZS5jb2ZmZWUiLCJub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiMgQWRkIHRoZSBmb2xsb3dpbmcgbGluZSB0byB5b3VyIHByb2plY3QgaW4gRnJhbWVyIFN0dWRpby4gXG4jIG15TW9kdWxlID0gcmVxdWlyZSBcIm15TW9kdWxlXCJcbiMgUmVmZXJlbmNlIHRoZSBjb250ZW50cyBieSBuYW1lLCBsaWtlIG15TW9kdWxlLm15RnVuY3Rpb24oKSBvciBteU1vZHVsZS5teVZhclxuXG5cbiMgVHdpc3RhYmxlXG5cblxuTGF5ZXIucHJvdG90eXBlLmVuYWJsZVR3aXN0YWJsZSA9IChyYW5nZSxjb25zdHJhaW5lZCktPlxuXHRcblx0QGNhbnZhc1BpbkxvY2F0aW9uID0gbnVsbCAjIHRoZSBwb2ludCBvZiByb3RhdGlvbiBpbiBjYW52YXMgY29vcmRpbmF0ZXNcblx0QHByZXZpb3VzQW5nbGUgPSAwXHRcblx0QGFuZ3VsYXJWZWwgPSAwXHQjIFVzZWQgZm9yIGZsaWNrZWQgc3BpblxuXHRAdHdpc3RSYW5nZSA9IHJhbmdlIHx8IFswLDM2MF0gICMgVXNlZCBmb3IgdHdpc3RWYWx1ZVxuXHRAdHdpc3RWYWx1ZSA9IDBcdFx0IyBUaGUgcm90YXRpb24gYXMgcGVyY2VudCBvZiB0aGUgdHdpc3RSYW5nZVxuXHRAdHdpc3RDb25zdHJhaW5lZCA9IGNvbnN0cmFpbmVkIHx8IHJhbmdlICE9IHVuZGVmaW5lZFx0ICMgV2hldGhlciBvciBub3QgdG8gY2xhbXAgdHdpc3RpbmcuXG5cdEBzcGluRGVjYXkgPSAwLjk1XG5cdFxuXHRoYW5kbGVUb3VjaE1vdmUgPSAoZSk9Plx0XHRcdFxuXHRcdG5ld0FuZ2xlID0gTWF0aC5hdGFuMihAY2FudmFzUGluTG9jYXRpb24ueS1lLnBhZ2VZLEBjYW52YXNQaW5Mb2NhdGlvbi54LWUucGFnZVgpXG5cdFx0bmV3QW5nbGVEZWcgPSAobmV3QW5nbGUgLyBNYXRoLlBJICogMTgwKVxuXHRcdG5ld0FuZ2xlRGVnVXBJc1plcm8gPSBuZXdBbmdsZURlZyAtIDkwXG5cdFx0YW5nbGVEaWYgPSBzaG9ydGVzdERpc3RhbmNlQmV0d2VlbkFuZ2xlcyhAcHJldmlvdXNBbmdsZSxuZXdBbmdsZURlZ1VwSXNaZXJvKVx0XHRcdFxuXHRcdEByb3RhdGlvbiArPSBhbmdsZURpZlx0XHRcdFxuXHRcdEBhbmd1bGFyVmVsID0gYW5nbGVEaWZcblx0XHRpZiBAdHdpc3RDb25zdHJhaW5lZFxuXHRcdFx0Y29uc3RyYWluZWRSb3RhdGlvbiA9IE1hdGgubWluKE1hdGgubWF4KEByb3RhdGlvbixAdHdpc3RSYW5nZVswXSksQHR3aXN0UmFuZ2VbMV0pXG5cdFx0XHRpZiBAcm90YXRpb24gIT0gY29uc3RyYWluZWRSb3RhdGlvbiBcdFx0XHRcdFxuXHRcdFx0XHRAYW5ndWxhclZlbCA9IDBcblx0XHRcdFx0QHJvdGF0aW9uID0gY29uc3RyYWluZWRSb3RhdGlvblxuXHRcdFx0XG5cdFx0aWYgIUBoYXNUd2lzdEJlZ2FuIGFuZCBAYW5ndWxhclZlbCAhPSAwXG5cdFx0XHRAaGFzVHdpc3RCZWdhbiA9IHRydWVcblx0XHRcdEBlbWl0IFwidHdpc3RTdGFydFwiXG5cdFx0QHByZXZpb3VzQW5nbGUgPSBuZXdBbmdsZURlZ1VwSXNaZXJvXG5cdFx0QHR3aXN0VmFsdWUgPSBVdGlscy5tb2R1bGF0ZShAcm90YXRpb24sQHR3aXN0UmFuZ2UsWzAsMV0pXHRcdFx0XG5cdFx0QGVtaXQgXCJ0d2lzdFwiXG5cdFxuXHRoYW5kbGVTcGlubmluZyA9IChlKT0+XHRcdFx0XHRcdFx0XG5cdFx0XG5cdFx0QHJvdGF0aW9uICs9IEBhbmd1bGFyVmVsXG5cdFx0QGFuZ3VsYXJWZWwgKj0gQHNwaW5EZWNheVxuXHRcdGlmIEB0d2lzdENvbnN0cmFpbmVkXG5cdFx0XHRjb25zdHJhaW5lZFJvdGF0aW9uID0gTWF0aC5taW4oTWF0aC5tYXgoQHJvdGF0aW9uLEB0d2lzdFJhbmdlWzBdKSxAdHdpc3RSYW5nZVsxXSlcblx0XHRcdGlmIEByb3RhdGlvbiAhPSBjb25zdHJhaW5lZFJvdGF0aW9uIFx0XHRcdFx0XG5cdFx0XHRcdEBhbmd1bGFyVmVsID0gMFxuXHRcdFx0XHRAcm90YXRpb24gPSBjb25zdHJhaW5lZFJvdGF0aW9uXHRcdFxuXHRcdEB0d2lzdFZhbHVlID0gVXRpbHMubW9kdWxhdGUoQHJvdGF0aW9uLEB0d2lzdFJhbmdlLFswLDFdKVx0XHRcblx0XHRAZW1pdCBcInNwaW5cIlx0XHRcblx0XHRpZiBNYXRoLmFicyhhbmd1bGFyVmVsKSA8IDAuMVxuXHRcdFx0YW5ndWxhclZlbCA9IDBcblx0XHRcdEBlbWl0IFwic3BpbkVuZFwiXG5cdFx0XHRGcmFtZXIuTG9vcC5vZmYgXCJ1cGRhdGVcIixoYW5kbGVTcGlubmluZ1xuXHRcdFx0XG5cdGhhbmRsZVRvdWNoRW5kID0gPT5cdFx0XG5cdFx0QGlzQmVpbmdUd2lzdGVkID0gZmFsc2VcdFx0XG5cdFx0QGVtaXQgXCJ0d2lzdEVuZFwiXG5cdFx0RXZlbnRzLndyYXAoZG9jdW1lbnQpLnJlbW92ZUV2ZW50TGlzdGVuZXIgXCJ0b3VjaG1vdmVcIixoYW5kbGVUb3VjaE1vdmVcblx0XHRFdmVudHMud3JhcChkb2N1bWVudCkucmVtb3ZlRXZlbnRMaXN0ZW5lciBcInRvdWNoZW5kXCIsaGFuZGxlVG91Y2hFbmRcblx0XHRGcmFtZXIuTG9vcC5vbiBcInVwZGF0ZVwiLGhhbmRsZVNwaW5uaW5nXG5cdFx0XG5cdEBvblRvdWNoU3RhcnQgKGUpPT5cblx0XHRsb2NhbFBpbkxvY2F0aW9uID0gXG5cdFx0XHR4OkB3aWR0aCAqIEBvcmlnaW5YXG5cdFx0XHR5OkBoZWlnaHQgKiBAb3JpZ2luWVxuXHRcdEBjYW52YXNQaW5Mb2NhdGlvbiA9IEBjb252ZXJ0UG9pbnRUb0NhbnZhcyhsb2NhbFBpbkxvY2F0aW9uKVxuXHRcdFx0XG5cdFx0IyBjYWxjdWxhdGUgaW5pdGlhbCBhbmdsZSBvZiBjbGljay90YXBcblx0XHRzdGFydEFuZ2xlID0gTWF0aC5hdGFuMihAY2FudmFzUGluTG9jYXRpb24ueS1lLnBhZ2VZLEBjYW52YXNQaW5Mb2NhdGlvbi54LWUucGFnZVgpXG5cdFx0c3RhcnRBbmdsZURlZyA9IChzdGFydEFuZ2xlIC8gTWF0aC5QSSAqIDE4MClcblx0XHRzdGFydEFuZ2xlRGVnVXBJc1plcm8gPSBzdGFydEFuZ2xlRGVnIC0gOTBcdFx0XG5cdFx0QHByZXZpb3VzQW5nbGUgPSBzdGFydEFuZ2xlRGVnVXBJc1plcm9cdFx0XHRcdFxuXHRcdEByb3RhdGlvblRvdWNoUG9pbnQgPSB7eDplLnBhZ2VYLHk6ZS5wYWdlWX1cblx0XHRAaGFzVHdpc3RCZWdhbiA9IGZhbHNlXG5cdFx0QGlzQmVpbmdUd2lzdGVkID0gdHJ1ZVxuXHRcdEV2ZW50cy53cmFwKGRvY3VtZW50KS5hZGRFdmVudExpc3RlbmVyIFwidG91Y2htb3ZlXCIsaGFuZGxlVG91Y2hNb3ZlXG5cdFx0RXZlbnRzLndyYXAoZG9jdW1lbnQpLmFkZEV2ZW50TGlzdGVuZXIgXCJ0b3VjaGVuZFwiLGhhbmRsZVRvdWNoRW5kXG5cdFx0RnJhbWVyLkxvb3Aub2ZmIFwidXBkYXRlXCIsaGFuZGxlU3Bpbm5pbmdcblx0XHRcblx0QHNldFR3aXN0VmFsdWUgPSAodik9PlxuXHRcdEB0d2lzdFZhbHVlID0gTWF0aC5tYXgoTWF0aC5taW4odiwxKSwwKVxuXHRcdEByb3RhdGlvbiA9IFV0aWxzLm1vZHVsYXRlKHYsWzAsMV0sQHR3aXN0UmFuZ2UpXG5cdFx0QGVtaXQgXCJ0d2lzdFwiXHRcdFxuXHRcdFxuXHRcdFxuTGF5ZXIucHJvdG90eXBlLmRpc2FibGVUd2lzdGFibGUgPSAtPlxuXHRwcmludCBcIk5PVCBXT1JLSU5HIFlFVFwiXG5cbiMgRXZlbnQgaGFuZGxpbmcgc2hvcnRjdXRzXG5MYXllci5wcm90b3R5cGUub25Ud2lzdCA9IChmbiktPlxuXHRAb24gXCJ0d2lzdFwiLGZuXG5cdFxuTGF5ZXIucHJvdG90eXBlLm9uVHdpc3RTdGFydCA9IChmbiktPlxuXHRAb24gXCJ0d2lzdFN0YXJ0XCIsZm5cblxuTGF5ZXIucHJvdG90eXBlLm9uVHdpc3RFbmQgPSAoZm4pLT5cblx0QG9uIFwidHdpc3RFbmRcIixmblxuXG5MYXllci5wcm90b3R5cGUub25TcGluID0gKGZuKS0+XG5cdEBvbiBcInNwaW5cIixmblx0XG5cbkxheWVyLnByb3RvdHlwZS5vblNwaW5FbmQgPSAoZm4pLT5cblx0QG9uIFwic3BpbkVuZFwiLGZuXG5cblx0XHRcdFxuI1xuIyBIZWxwZXJzXG4jXG5cbiMgQ29udmVydCBhbmdsZSB0byB2YWx1ZSBiZXR3ZWVuIDDigJMzNjBcbm5vcm1hbGl6ZUFuZ2xlID0gKGEpLT5cblx0cmV0dXJuIChhICsgMzYwKjEwMDAwKSUzNjBcblxuIyBTaG91bGQgYmUgbmFtZWQgc2hvcnRlc3REaXN0YW5jZSBiZXR3ZWVuIE5PUk1BTElaRUQgYW5nbGVzLiBcbnNob3J0ZXN0RGlzdGFuY2VCZXR3ZWVuQW5nbGVzID0gKGExLGEyKS0+XG5cdGExTm9ybSA9IG5vcm1hbGl6ZUFuZ2xlKGExKVxuXHRhMk5vcm0gPSBub3JtYWxpemVBbmdsZShhMikgXHRcblx0cjEgPSBhMk5vcm0tYTFOb3JtXHRcblx0aWYgTWF0aC5hYnMocjEpID4gMTgwIFxuXHRcdGlmIHIxID4gMCB0aGVuXHRyZXR1cm4gcjEgLSAzNjAgXG5cdFx0ZWxzZSByZXR1cm4gcjEgKyAzNjAgXG5cdGVsc2Vcblx0XHRyZXR1cm4gcjEiLCIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUNBQTtBRFFBLElBQUE7O0FBQUEsS0FBSyxDQUFDLFNBQVMsQ0FBQyxlQUFoQixHQUFrQyxTQUFDLEtBQUQsRUFBTyxXQUFQO0FBRWpDLE1BQUE7RUFBQSxJQUFDLENBQUEsaUJBQUQsR0FBcUI7RUFDckIsSUFBQyxDQUFBLGFBQUQsR0FBaUI7RUFDakIsSUFBQyxDQUFBLFVBQUQsR0FBYztFQUNkLElBQUMsQ0FBQSxVQUFELEdBQWMsS0FBQSxJQUFTLENBQUMsQ0FBRCxFQUFHLEdBQUg7RUFDdkIsSUFBQyxDQUFBLFVBQUQsR0FBYztFQUNkLElBQUMsQ0FBQSxnQkFBRCxHQUFvQixXQUFBLElBQWUsS0FBQSxLQUFTO0VBQzVDLElBQUMsQ0FBQSxTQUFELEdBQWE7RUFFYixlQUFBLEdBQWtCLENBQUEsU0FBQSxLQUFBO1dBQUEsU0FBQyxDQUFEO0FBQ2pCLFVBQUE7TUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLEtBQUwsQ0FBVyxLQUFDLENBQUEsaUJBQWlCLENBQUMsQ0FBbkIsR0FBcUIsQ0FBQyxDQUFDLEtBQWxDLEVBQXdDLEtBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxDQUFuQixHQUFxQixDQUFDLENBQUMsS0FBL0Q7TUFDWCxXQUFBLEdBQWUsUUFBQSxHQUFXLElBQUksQ0FBQyxFQUFoQixHQUFxQjtNQUNwQyxtQkFBQSxHQUFzQixXQUFBLEdBQWM7TUFD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