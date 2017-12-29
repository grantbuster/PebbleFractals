var rocky = require('rocky');

var switch1 = true ;

function fractionToRadian(fraction) {
  return fraction * 2 * Math.PI;
}

function drawHand(ctx, cx, cy, angle, length, width) {
  // Find the end points
  var x2 = cx + Math.sin(angle) * length;
  var y2 = cy - Math.cos(angle) * length;

  // Configure how we want to draw the hand
  ctx.lineWidth = width;
  ctx.strokeStyle = 'white';

  // Begin drawing
  ctx.beginPath();

  // Move to the center point, then draw the line
  ctx.moveTo(cx, cy);
  ctx.lineTo(x2, y2);

  // Stroke the line (output to display)
  ctx.stroke();
  
  return [x2, y2] ;
}

function drawFractHand(N, ctx, s_xy, m_xy, h_xy, hms_angle, hms_len, width) {
  
  var len_mult=0.9;
    
  var h_len = hms_len[0];
  var m_len = hms_len[1];
  var s_len = hms_len[2];
  
  var h_angle = hms_angle[0];
  var m_angle = hms_angle[1];
  var s_angle = hms_angle[2];
  
	// shift all fractal hands by 180 degrees (pi radians) so that they collapse at the top of the hour
  var s_angle_og = hms_angle[2]+Math.PI;
	
	console.log('HMS angles: ' + h_angle + " " + m_angle + " " + s_angle);

  for (var i = 1; i < (N+1); i++) { 
    
    h_len = h_len*len_mult;
    m_len = m_len*len_mult;
    s_len = s_len*len_mult;
    
    if (width>1) {
      width=width/2;
    }
    
    h_angle = h_angle+s_angle_og;
    m_angle = m_angle+s_angle_og;
    s_angle = s_angle+s_angle_og;
    
    h_xy = drawHand(ctx, h_xy[0], h_xy[1], h_angle, h_len, width);
    m_xy = drawHand(ctx, m_xy[0], m_xy[1], m_angle, m_len, width);
    s_xy = drawHand(ctx, s_xy[0], s_xy[1], s_angle, s_len, width);
  
  }
  
  
}

rocky.on('draw', function(event) {
  var ctx = event.context;
  var d = new Date();

  // Clear the screen
  ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

  // Determine the width and height of the display
  var w = ctx.canvas.unobstructedWidth;
  var h = ctx.canvas.unobstructedHeight;

  // Determine the center point of the display
  // and the max size of watch hands
  var cx = w / 2;
  var cy = h / 2;

  // -20 so we're inset 10px on each side
  var maxLength = (Math.min(w, h) - 20) / 2;
  
  var h_len = maxLength * 0.5 ;
  var m_len = maxLength * 0.7 ; 
  var s_len = maxLength * 0.95 ;
	
  var start_len = maxLength * 0.0;
  
  var width1 = 6 ;
  
  // ================================================================================
  // Calculate the second hand angle
  console.log('calculating second hand');
  var secondFraction = (d.getSeconds()) / 60;
  var secondAngle = fractionToRadian(secondFraction);
  
  // Draw the second hand
  console.log('drawing second hand');
  var x1 = cx + Math.sin(secondAngle) * start_len;
  var y1 = cy - Math.cos(secondAngle) * start_len;
  var s_xy = drawHand(ctx, x1, y1, secondAngle, s_len, width1/2);

  // ================================================================================
  // Calculate the minute hand angle
  console.log('calculating minute hand');
  var minuteFraction = (d.getMinutes()) / 60;
  var minuteAngle = fractionToRadian(minuteFraction);

  // Draw the minute hand
  console.log('drawing minute hand');
  x1 = cx + Math.sin(minuteAngle) * start_len;
  y1 = cy - Math.cos(minuteAngle) * start_len;
  var m_xy = drawHand(ctx, x1, y1, minuteAngle, m_len, width1);
  
  // ================================================================================
  // Calculate the hour hand angle
  console.log('calculating hour hand');
  var hourFraction = (d.getHours() % 12 + minuteFraction) / 12;
  var hourAngle = fractionToRadian(hourFraction);

  // Draw the hour hand
  console.log('drawing hour hand');
  x1 = cx + Math.sin(hourAngle) * start_len;
  y1 = cy - Math.cos(hourAngle) * start_len;
  var h_xy = drawHand(ctx, x1, y1, hourAngle, h_len, width1);
  
  // ================================================================================
  // Draw fractal hands 
  
  if (d.getSeconds() == 0 && switch1 == false){
    switch1 = true ;
  } else if (d.getSeconds() == 0 && switch1 == true){
    switch1 = false ;
  }
    
	// set number of fractal hands 
  var N = 15 ;  
  var hms_angle = [hourAngle,minuteAngle,secondAngle];
  var hms_len = [h_len,m_len,s_len];
  
  
  if (switch1 == true) {
      console.log('drawing fractal hands');
      drawFractHand(N, ctx, s_xy, m_xy, h_xy, hms_angle, hms_len, width1) ;
  }
	
	// ================================================================================
	
	// Draw a full circle outline
	ctx.strokeStyle = 'white';
  ctx.lineWidth = 4;
	ctx.beginPath();
	ctx.arc(w/2, h/2, w/50, 0, 2 * Math.PI, false);
	ctx.stroke();
	// Draw a full circle outline
	ctx.strokeStyle = 'black';
  ctx.lineWidth = 5;
	ctx.beginPath();
	ctx.arc(w/2, h/2, w/150, 0, 2 * Math.PI, false);
	ctx.stroke();
	
	
	// Draw a full circle outline
	//ctx.strokeStyle = 'white';
  //ctx.lineWidth = 2;
	//ctx.beginPath();
	//ctx.arc(w/2, h/2, s_len*1.1, 0, 2 * Math.PI, false);
	//ctx.stroke();
  
  // ================================================================================
	
	// display digital time 
	
	var hrstr=d.getHours()% 12;
	var minstr=d.getMinutes();
	if (minstr<10){
		minstr="0"+minstr;
	}
	if (hrstr==0){
		hrstr="12";
	}
	var timestr= hrstr+":"+minstr;
	
  // Set the text color
  ctx.fillStyle = 'white';
  // Center align the text
  ctx.textAlign = 'center';
	// Set font
  ctx.font = '16px Calibri Bold';
  ctx.font = '16px Arial Bold';
  // Display the time, in the middle of the screen
	ctx.fillText(timestr, w / 2, h * 0.02 , w);
});


rocky.on('secondchange', function(event) {
  // Request the screen to be redrawn on next pass
  rocky.requestDraw();
});