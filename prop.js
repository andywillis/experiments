// JS demo
// Init Datas
  x = 9;
  y = 336;
  z = 10;
  K = [];
  L = [[20,290]];

  // Scene
    p = document.body.children[X=Y=J=T=V=0];
      p.width = W = 224;
      p.height = H = 352;
    q = p.getContext('2d');

// Functions
  // Draw rectangle
    function R(x,y,w,h,c){
      q.fillStyle = c;
      q.fillRect(x,y,w,h);
    }
  // Check pixel color at (a;b)
    function C(a,b){
      j = (b > 336) ? 0 : q.getImageData(a,b,1,1).data;
      if(j[0] == 255 & !j[1] & !j[2]) return 1;
      return;
    }
  // Generate new platform
    function P(y){
      if (y > 40) {
        e = r(30,134);
        f = y - r(40,80);
        L.push([e,f]);
      }
    }
  // Generate random number (interval = (a;b))
    function r(a,b){return a + Math.round(Math.random() * (b - a));}

// Game loop
  setInterval(
    function(){
    if (!V) {
      T++;
      s = (T > 300) ? 1 : 0;

      if (s) y++;

      a = x + X;
      b = a + 15;       

      // Horizontal limits
        if(a < 0) x=X=0;
        if(b > W){
          x=208;
          X=0;
        }

      // Update position
        x += X;
        y += Y;
      
      O = 0;
        
      if (Y >= 0) {
        m = 5;
        while (m < 14) {
          c = y + 15;
          if(C(a,c) || C(b,c)){
            g = C(a,c) ? a : b;
            while (C(g,y + 14)) y--;
            O = 1;
            m = 14;
          }
          m += 4;
        }
        if (y >= 336) {
          if (!s) {
            O = 1;
            y = 336;
          }
          else V=1;
        }
      }
      if (O) Y=J=0;
      else if (Y < 11) Y++;

      // Draw scene
        R(0,0,W,H,'#9CF');
        R(x,y,16,16,'#000');
        
        // Add new platform and draw platforms
          P(L[L.length-1][1]);
          for (I in L) {
            if (s) L[I][1] += 1;
            R(L[I][0],L[I][1],60,16,'red');
          }
    }
    },
    20
  );
// Keyboard events
  onkeydown = function(e){Z(e,1);};
  onkeyup = function(e){Z(e,0);};
  function Z(e,u){
    E = e.keyCode;
    if(!E-37 >> 2){           
      if(E == 38) {
        if (!J & Y <= 1) {
          J = 1;
          Y = -14;
        }
      }
      else {
        j = K.indexOf(E);
        if(j > -1) K.splice(j,1);
        !u ? E = K[K.length-1] : K.push(E);
        X = E^37 ? E^39 ? 0 : 2 : -2;
      }
    }
  }

// JS demo
// -----------------------------------------------------------------------------
//  Configuration and scene
// -----------------------------------------------------------------------------
// Size of the canvas
w = 300;

// Spheres : radius, [cx,  cy,  cz], R,  G,  B, specular exponent, reflectiveness 
// R, G, B in [0, 9], reflectiveness in [0..9]
//
S = [
    H=99, [ 0, -H, 0],  9, 9, 0,  w,    4,  // Yellow sphere. H is used as a "big constant" - "H" < "99"
    1,    [ 0,  0, 3],  9, 0, 0,  H,    5,  // Red sphere
    1,    [-2,  1, 4],  0, 9, 0,  9,    5,  // Green sphere
    1,    [ 2,  1, 4],  0, 0, 9,  H,    6 // Blue sphere
  ];

// Ambient light. Hardcoding it in the lighting code feels like cheating so I won't
A = 2;

// Point lights : intensity, [x,  y,  z]
// Intensities should add to 10, including ambient
T = [
    8, [2, 2, 0],
  ];

// -----------------------------------------------------------------------------

// Shorten some names
G=Math;
Q=G.sqrt;

// Get to the raw pixel data
v = document.body.childNodes[1];
v.width = v.height = w;

O = v.getContext("2d");
V = O.getImageData(a=0, 0, w, w); // "a=0;" takes 4 bytes, doing it here saves 2 bytes
P = V.data;

// Dot product
function d(Y, Z)
{
  return Y[0]*Z[0] + Y[1]*Z[1] + Y[2]*Z[2];
}


// Find nearest intersection of the ray from B in direction D with any sphere
// "Interesting" parameter values must be in the range [L, U]
// Returns the index in S of the center of the hit sphere, or 0 if none
// The parameter value for the hit is in the global variable W
function N (B, D, L, U)
{
  W = H;  // Min distance found
  
  // For each sphere
  for (s = n = 0; r = S[n++];)  // Get the radius and test for end of array at the same time; S[n] == undefined ends the loop
  {
    // Compute quadratic equation coefficients K1, K2, K3
    F = 2*(d( C = S[n] , D) - d(B, D)); // -K2, also store the center in C
    J = 2*d(D, D);  // 2*K1
    
    // Compute sqrt(Discriminant) = sqrt(K2*K2 - 4*K1*K3), go ahead if there are solutions
    if ( M = Q( F*F - 2*J*(d(B, B) + d(C, C) - r*r - 2*d(B, C)) ) )
    {
      // Compute the two solutions
      for (e = 2; e--; M = -M)  // TODO : I have a feeling this loop can be minimized further, but I can't figure it out
      {
        t = (F + M)/J;
        if (L < t && t < U && t < W) 
          s=n, W=t;
      }
    }
    
    n += 6;
  }

  // Return index of closest sphere in range; W is global
  return s;
}


// Helper : f(Y, Z, k)  =  Y - Z*k. Since f is used more with k < 0, using - here
// saves a couple of bytes later
function f (Y, Z, k)
{
  return [Y[0] - Z[0]*k, Y[1] - Z[1]*k, Y[2] - Z[2]*k];
}


// Trace the ray from B with direction D considering hits in [L, U]
// If p > 0, trace recursive reflection rays
// Returns the value of the current color channel as "seen" through the ray
// q is a fake parameter used to avoid using "var" below
function R (B, D, L, U, p, q)
{
  // Find nearest hit; if no hit, return black
  if (!(g = N(B, D, L, U)))
    return 0;
  
  // Compute "normal" at intersection : o = X - S[g]
  o = f( 
    X = f(B, D, -W),  // Compute intersection : X = B + D*W = B - D*(-W)
    S[g], 1);

  // Start with ambient light only
  i = A;
  
  // For each light
  for (l = 0; u = T[l++]; ) // Get intensity and check for end of array
  {
    // Compute vector from intersection to light (I = T[l++] - X) and 
    // j = <N,L> (reused below)
    j = d(o, I = f(T[l++], X, 1) );

    // V = <N,L> / (|L|*|N|) = cos(alpha)
    // Also, |N|*|L| = sqrt(<N,N>)*sqrt(<L,L>) = sqrt(<N,N>*<L,L>)
    v = j / Q(d(I, I)*d(o, o));
    
    // Add diffuse contribution only if it's facing the point 
    // (cos(alpha) > 0) and no other sphere casts a shadow
    // [L, U]  =  [epsilon,  1] - epsilon avoids self-shadow, 1 doesn't look 
    // farther than the light itself
    if (v > 0 && !N(X, I, .01, 1))
    {
      i += v*u;

      // Specular highlights
      //
      // specular = (<R,V>   / (|R|*|V|))   ^ exponent
      //      = (<-R,-V> / (|-R|*|-V|)) ^ exponent
      //      = (<-R,D>  / (|-R|*|D|))  ^ exponent
      //
      // R = 2*N*<N,I> - I
      // M = -R = -2*o*<o,I> + I = I + o*(-2*<o,I>)
      //
      v = G.pow( d( M = f(I, o, 2*j), D)/ Q(d(M, M)*d(D, D)), S[g+4]);

      // Add specular contribution only if visible
      v > 0 && 
        (i += v*u);
    }
  }
  

  // Compute the color channel multiplied by the light intensity. 2.8 "fixes"
  // the color range in [0, 9] instead of [0, 255] and the intensity in [0, 10]
  // instead of [0, 1],  because 2.8 ~ (255/9)/10
  // 
  // S[g] = sphere center, so S[g+c] = color channel c (c = [1..3] because a=c++ below)
  q = S[g+c]*i*2.8;
  
  // If the recursion limit hasn't been hit yet, trace reflection rays
  // o = normal
  // D = -view
  // M = 2*N*<N,V> - V = 2*o*<o,-D> + D = D - o*(2*<o,D>)
  k = S[g+5]/9;

  return p--  ? R(X, f(D, o, 2*d(o, D)), .01, H, p)*k + q*(1-k)
        : q;
}

// For each y; also compute h=w/2 without paying an extra ";"
for (y = h=w/2; y-- > -h;)

  // For each x
  for (x = -h; x++ < h;)
  {
    // For each color channel
    for (c = 0; ++c < 4;)
      // Camera is at (0, 1, 0)
      //
      // Ray direction is (x*vw/cw, y*vh/ch, 1) where vw = viewport width, 
      // cw = canvas width (vh and ch are the same for height). vw is fixed
      // at 1 so (x/w, y/w, 1)
      //
      // [L, U] = [1, H], 1 starts at the projection plane, H is +infinity
      //
      // 2 is a good recursion depth to appreciate the reflections without
      // slowing things down too much
      //
      P[a++] = R([0, 1, 0], [x/w, y/w, 1], 1, H, 2);
      
    P[a++] = 255; // Opaque alpha
  }

O.putImageData(V, 0, 0);

// JS demo
var bugs=[],s=16,M=Math,t=c=O=K=E=y=0,D=1,i,n,img,r,dest,head,luckyNumbers,tail,numBugs=1200,h=300,f=150,c={},luckyNumbers=[];
      rand=M.random,round=M.round,P=M.PI,floor=M.floor,startStr='rgb(';
      with(document.body.children.c)width=height=h,x=getContext('2d');
      x.font = '200px Times';

      setInterval(function(){
        //get lottery numbers, in number and image form..
        n = round(rand()*48)+1;
        if(y<6 & !(n in c)){
          x.fillStyle=startStr+'2,0,0)';
          x.fillText(n, f-x.measureText(n).width/2,257);
          img = x.getImageData(0,0,h,h).data;
          dest = [];
          for(i=0;i<img.length;i+=4){
            if(img[i] == 2 & rand() > .9)
              dest.push([(i/4) % h, floor(i/1600)]);
          }
          luckyNumbers.push([n, dest]);
          c[''+n]=1;
          y++;
        }

        //reset the canvas..
        x.fillStyle=startStr+'200,200,200)';
        x.fillRect(0,0,h,h);
        
        x.fillStyle=startStr+'1,0,0)';
        dest = luckyNumbers[K][1];
        for(n = 0; n < numBugs; n++){
          if(!E) bugs.push([{
               x: f,
               y: f,
               angle:floor(rand()*s)
            },{x:f,y:f}]);
        
          //draw the bug..
          head = bugs[n][0];
          tail = bugs[n][1];
          //set dest to be the correct thing..
          r=dest[n%dest.length]
          head.destX = r[0];
          head.destY = r[1];
          
          x.beginPath();
          x.moveTo(head.x, head.y);
          x.lineTo(tail.x, tail.y);
          x.stroke();
          //update it's position..
          tail.x = head.x;
          tail.y = head.y;
          r=head.angle*P/8;
          head.x += M.sin(r) * 2;
          head.y -= M.cos(r) * 2;

          //update angle/operation..
          //only change if with low prop..
          if(D){
            r = round(8*M.atan((head.x-head.destX)/(head.destY-head.y))/P);
            r += (head.y < head.destY) ? 24: s;
            r%=s;
            //turn towards the desired angle..
            if(r == head.angle){
              head.op = 1;
            } else if(rand() > .8){
              if(r < head.angle) r+=s;
              head.op = (r - head.angle < 8) ? 2 : 0;
            }
          } else {
            r = rand();
            head.op = (r < 0.3) ? 0 : (r < 0.6) ? 2 : 1;
          }
          head.angle +=(!head.op)?15:(head.op==2)? 17 : s;
          head.angle %= s;
        }
        if(++E>100){
          if(t%3){
            D=!D;
            if(t%2){
              K++;
              K %= 6;
            }
          }
          t++;
          D!=D
          E=0;
        }
      },20);

// JS Demo
// line
function A(x,y,z,w,c)
{
  with (G) 
  {
    lineWidth = 4;
    strokeStyle = 'rgb(' + F(c[0]*h) + ',' + F(c[1]*h) + ',' + F(c[2]*h) + ')';
    beginPath();
    moveTo(x, y);
    lineTo(z, w);
    stroke();
  }
}

// sky
function B()
{
  a = y / h;
  return [.2 + a, .3 + a,.6 + a * .7];
}

// noise
function C(x, y)
{
  s = M.log(d + 20) / .7 - 1;
  b = s - (s = F(s));
  c = q = 0;
  for (i = s; i < s + 8; i++)
  {
    t = E(2, i);
    X = x / t;
    Y = y / t;
    u = X - F(X);
    v = Y - F(Y);
    X -= u;
    Y = (Y - v) * I;
    Z = Y + I;
    a=[
      Y % J + X++ % I,
      Y % J + X % I,
      Z % J + X-- % I,
      Z % J + X % I
    ];
    l = [];
    for (j = 0; j < 4; j++)
      l[j] = N[(F(i) * I + a[j]) % L];

    t *= i == s ? 1 - b : i == s + 7 ? b : 1;

    c += ( ((1 - u) * l[0] + u * l[1]) * (1 - v) + ((1 - u) * l[3] + u * l[2]) * v ) * t;
    q += t
  };
  c = E(M.abs(c / q * 2 - 1), 1.5);
  return y < 400 ? c * y / 399 : c
}

// contour
function D()
{
  d = 4 + z / I;

  for (x = 0; x < w; x++)
  {
    o = C(P = (x - w/2) * d + w, z);

    y = h - o * 2200 / (d + 20) - (d - 6) * 5;

    if (x)
    {
      H = C(P + d, z) - o;
      $ = C(P, z + d) - o;
      m = M.sqrt(H * H + 9/J + $ * $);
      l = 1 - M.max(0, H / m * .1 + $ / m * .9);

      for (i=0, c=[], b = z / L / 2.1; i<3; i++)
      {
        c[i] =
          (1 - b) * (l + o) / 5 +
          b * B()[i];
      }
      
      A(x-1,ly,x,y,c);
    }

    ly = y;
  }

  z -= d;

  if (z > 0)
    setTimeout(D, 1);
}

M = Math;

E = M.pow;
F = M.floor;
I = 1000;
J = I * I;
L = 9 * I;
N = [];

for (i = 0; i < L; N[i++] = M.random());

with (document.getElementById('c'))
{
  width = w = I;
  height = h = 255;
  G = getContext('2d')
};

for (y = 0; y < h; A(0,y,w,y++,B()));

z = L * 2.1;

D()

// jS demp
n=X=Y=8;a=.994;g=.97;N=[991,149,192,921,199,919];d=document;c=d.body.children[0];c.onclick=function(e){l.push({x:X,y:Y,u:0,v:0,r:25});n++};c.onmousemove=function(e){S=e.clientX;T=e.clientY;U=S-X;V=T-Y;X=S;Y=T;for(i=0;i<n;){with(l[i++]){S=x-X;T=y-Y;D=S*S+T*T;if(D<r*r){u+=U/4;v+=V/4}}}};d=d.documentElement;w=c.width=d.clientWidth-22;h=c.height=d.clientHeight-22;L=c.getContext("2d");l=[];for(i=0;i++<n;)l.push({x:w/2+i,y:150,u:i*2-9,v:-i,r:25});setInterval(function(){L.fillStyle="#ddd";L.fillRect(0,0,w+50,h+50);for(i=0;i<n;i++){with(l[i]){L.fillStyle="#"+N[i%6];L.beginPath();L.arc(x,y,r,0,6.2,0);L.fill();k=w-r;x+=u;u*=a;x>k||x<r?u=-u:0;x<r?x=r:(x>k?x=k:0);k=h-r;y+=v;v*=a;y>k||y<0?v=-v:0;y>k?y=k:0;v+=.15;for(j=i+1;j<n;j++){o=l[j];s=x-o.x;t=y-o.y;I=s*s+t*t;f=Math.sqrt(I);m=o.r+r;if(f<m){p=m-f;q=p/2;J=q*s/m;K=q*t/m;x+=J;y+=K;o.x-=J;o.y-=K;z=(s*(u-s)+t*(v-t))/I+1;A=s*z;B=t*z;C=A-u;D=B-v;z=(-s*(o.u+s)-t*(o.v+t))/I+1;E=-s*z;F=-t*z;G=E-o.u;H=F-o.v;u=(E-C)*g;v=(F-D)*g;o.u=(A-G)*g;o.v=(B-H)*g}}}}},12)

// JS demo
var doc = document;
var canvas = doc.getElementById("c");
var width = canvas.width = 640;//innerWidth;
var height = canvas.height = 128;//innerHeight;
var mySinR=[],mySin=[];
xg=[];xr=[];
//xg[0]=255;xr[0]=255;
//xg[1]=0;xr[1]=0;
//xg[2]=255;xr[2]=0;
//xg[3]=0;xr[3]=255;
xg[1]=xr[1]=xr[2]=xg[3]=0;
xg[0]=xr[0]=xg[2]=xr[3]=255;
var cpt=0;
//Init the sin lookup arrays for waves fx & rubber fx
i=2048;while(i) {
  mySinR[--i]=16*Math.sin(i*3.14/128);
  mySin[i]=256*(1+Math.pow(Math.cos(i*3.14/1024),3));
}

//get canvas context, clear BG (assume fillStyle is #000) and then prepare for white font drawing.
var ctx = canvas.getContext("2d");
ctx.fillRect(0, 0, width, height);
ctx.fillStyle = '#fff';

// get 2 rendering image : iamge1 for waves, image2 for rubber
var image1 = ctx.getImageData(0, 0, width, height);
var image2 = ctx.getImageData(0, 0, width, height);
var data1 = image1.data;
var data2 = image2.data;

// Black html background
doc.body.style.background = "#000";

// Draw a vertical line for a wave
function vlineR(ofs,ysize,colBG1,colBG2) {
    ysize+=64;
    y=0;while (y<(height-ysize)>>1) {
      data1[ofs] = (((ofs>>6)+(y++>>4))&1?colBG1:colBG2);
        ofs += width<<2;
    }
    while (y++<(height+ysize)>>1){
        data1[ofs] = 255;
        ofs += width<<2;
    }
    while (y<height) {
        data1[ofs] = (((ofs>>6)+(y++>>4))&1?colBG1:colBG2);
        ofs += width<<2;
    }
}

// Zoom function for rubber
function t(ys,xf) {
    oy = 0;
    oi=(height<<8)/ys;
    y=0;while (y++<ys) {
  oy+=oi;
  os=(x + (oy>>8)*width)<<2;
  data2[od] = xg[xf]^data1[os]*ys>>7;
  data2[od+1] = xr[xf]^data1[os+1]*ys>>7;
  data2[od+2] = xr[xf]^data1[os+2]*ys>>7;
  od+=width<<2;
    }
}

// Draw a vertical line for the rubber fx
function rubberY(ysize1) {
    od = x<<2;
    t(ysize1&127,(ysize1>>7));
    t(height-(ysize1&127),((ysize1>>7)-1)&3);
}

function f() {
    cpt+=4;
    x=width;
    while (x) {
    //Waves are composed by adding multiple sinus with different 'speed'
        a=( cpt + --x*4 ) & 511;
      b= ( cpt - x*2 ) & 511;
      c=  ( -cpt*2 - x ) & 511;
        vlineR(x<<2,mySinR[a ]+mySinR[b]-mySinR[c],16,8);
        vlineR((x<<2)+1,mySinR[c]+mySinR[a]-mySinR[ b],16,4);
        vlineR((x<<2)+2,mySinR[b]+mySinR[c]-mySinR[a],64,32);
        rubberY(mySin[(cpt*2+mySin[(cpt - x/2)&2047])&2047]&511);
    }
    ctx.putImageData(image2, 0, 0);
    ctx.fillText("Rubber fun/Yoyofr", 9, 9);
}
setInterval(f, 20); 


// JS demo
/*
A rotating 3D computer wireframe.

Luis Gonzalez - lobster@luis.net

released for http://www.js1k.com

Features: 
- CPU, Keyboard and Monitor 
- 3D Text that displays "1K" on the monitor
- browser scaling and auto-centering
- works in firefox, chrome, safari and opera

3D Model created in 3D Studio Max 9 then exported to wavefront OBJ format (quads).
The 3D model was hand tweaked to occupy as many whole numbers as possible for its points.
then manually compressed using ASCII table reference

download 3D computer model here:
http://luis.net/projects/1k/3d/computer.obj (Wavefront OBJ quads)

screenshot:
http://www.flickr.com/photos/luis2048/4930263977/
http://luis.net/projects/1k/3d/screenshot.png


*/

// set it up 
E=document.getElementById("c");
M=Math;  // its math time
c=0;     // our global counter used for rotation
X=[];    
Y=[];

// numbers used for verticies
points = [0,7,8,9,-12.6,-3.7,-2.1,12,-2.5,-0.3,-9.5,-1.3,-14.2,-11,-5.5,-0.9,-7.1,-1.9,-7.8,-11.9,-1.5,-5,-3,-10.2,-0.7,-10,-16,-1,-2,-4,1,4,6,7.5,6.7,-0.5];

// decompress data points in either 3(verticies - [[X1,Y1,Z1]]) or 4(faces - [[1,2,3,4]]) using ASCII table charcodes
function S(a,b){
  C=[]; // array we are building
  for(y=V=0;y<a.length;){ // loop through entire string "000I@H1@H1>9"
    C[V]=[];    // create a sub array to contain points(4) or vertice(3) defined by b
    for(x=0;x<b;x++){ // loop either 3 or 4 times
      W=a.charCodeAt(y++)-48;  // G  = (charcode 71)-48 = (23 array index) = "-10.2" or 23
      C[V][x]=b<4?points[W]:W; // append either points to new array or index position
    } 
    V++;
  }
  return C; // return our newly assembled array 
}

// verticies (X,Y,Z)   
// returns the following format: h=[[-10,-7.1,-.7],[7,-7.1,-.7],[7,-5.5,-.3],[-10,-5.5,-.3],[-10,-9.5,-1.3]];
h=S("000I@H1@H1>9I>9I:;1:;1B?IB?ICA1CA1GDIGDI<81<8146I4623023E=3E=30=5E=50=JE=JF2502JF2JE25E1371F71F0130IF0IF7I37I30FFOFF3MF2MFOKFOKF3LF3LFONF30F3KFQKFP0FONFOSFRKFP",3);

// faces - connect four vertices to make a quad
// returns the following format: n=[[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16],[17,18,19,20]];
n=S("123456789:;<=>?@ABCDEFDCGHFEIJKLAILBFIADGKJHMNOPQRSTONRQSMPTUVWXYZ[\\]^_`abcd",4);

// main animation loop
setInterval(
    function(){
        w=innerWidth-24;        // get browser dimensions - 24 margin to prevent scrollbars
        j=innerHeight-24;       
        E.width=w;              // set canvas to occupy full screen 
        E.height=j;             // ditto for height
        with(E.getContext("2d"))
        {
            strokeStyle='#555'; // light gray
            clearRect(0,0,w,j); // clear the screen
            H=M.sin(c);         // im spinning
            O=M.cos(c+=0.02);    // counter spin and increment c for animation 
            // our tiny 3D engine
            for(g in n)         // loop through each face(4) which have 3 vertices in it 
                for(u in f=n[g]){
                    l=h[f[u]];
                    m=h[f[[1,2,3,0][u]]]; // connect our verticies to form a quad 1-2 then 2-3 then 3-0 then 0-1
                    P=[l[0],m[0]];
                    Q=[l[1],m[1]];
                    R=[l[2],m[2]];
                    for(i in R)
                    {
                        Z=-P[i]*O*O-Q[i]*H*O+R[i]*H+27; 
                        X[i]=j/2*(-P[i]*H+Q[i]*O)/Z+(w/2);
                        Y[i]=j/2*(-P[i]*O*H-Q[i]*H*H-R[i]*O)/Z+j/2-6;
                    }
            // draw our 3D line in 2D space
            beginPath();
            moveTo(X[0],Y[0]);
            lineTo(X[1],Y[1]);
            stroke();
        }
    }
},30)


// JS demo
var canvas = document.getElementById('c'),
  g = canvas.getContext('2d'),
  colors = ['#59031A', '#5BA68A', '#D9C45B', '#D95829', '#D90404'],
  board = [],
  row = 11,
  col = size = 21,
  current, fl = Math.floor,
  neighbour = function (o, dir) {
    var n, i;
    if (o && (i = board.indexOf(o)) >= 0) {
      if (dir == 0) n = board[i % col == 0 ? -1 : i - 1]; // left
      if (dir == 1) n = board[i % col == col - 1 ? -1 : i + 1]; // right
      if (dir == 2) n = board[i - col]; // top
      if (dir == 3) n = board[i + col]; // bottom
    }
    return n;
  },
  traverse = function (o, highlight) {
    if (hasMatcher(o)) {
      o.h = highlight;
      for (var j = 0; j < 4; j++) {
        var dir = neighbour(o, j);
        if (dir && dir.h != highlight && dir.c == o.c) traverse(dir, highlight);
      }
    }
  },
  hasMatcher = function (o) {
    for (var j = 0; j < 4; j++) {
      var dir = neighbour(o, j);
      if (dir && dir.c == o.c) return true;
    }
  },
  reset = function () {
    for (var i = 0; i < row * col; i++) board[i] = {
      c: colors[fl(Math.random() * colors.length)]
    };
    update();
  },
  update = function (e) {
    if (e) {
      var pos = fl(e.clientX / size) + fl(e.clientY / size) * col;
      if (board[pos] != current) {
        traverse(current, false);
        traverse(board[pos], true);
        current = board[pos];
      }
      if (e.type == "click") {
        for (var i in board)
            if(board[i] && board[i].h)
              for(var j = i; j >= 0; board[j] = board[j -= col]);
        for(var i = 0; i < col; i++) {
          var index = (row - 1) * col + i, w = 0;
          while(!board[index + w] && (index % col) + w++ < col);
          if(w > 0)
            for(var j = index % col; j < col - w; j++)
              for(var k = 0; k < row; k++) {
                var l = k * col + j;
                board[l] = board[l+w];
                board[l+w] = null;
              }
        }
        var left = 0, gameover = true;
        for (var i in board)
        if (board[i]) {
          gameover = gameover && !hasMatcher(board[i]);
          left++;
        }
      }
    }
    g.fillStyle = '#000';
    g.fillRect(0, 0, size * col, size * row);
    for (var i in board) {
      var o = board[i];
      if (o) {
        g.fillStyle = o.c;
        g.fillRect((i % col) * size + (o.h ? 0 : 2), fl(i / col) * size + (o.h ? 0 : 2), size - (o.h ? 0 : 1), size - (o.h ? 0 : 1));
      }
    };
    if (gameover) {
      alert('left: ' + left);
      reset();
    }
  };
document.body.style.margin = 0;
canvas.onclick = canvas.onmousemove = update;
canvas.width = size * col;
canvas.height = size * row;
reset();

// JS demo
(function () {
    var canvas = document.getElementById('c'),
        ctx = canvas.getContext('2d'),
        w = canvas.width = innerWidth,
        h = canvas.height = innerHeight,
        M = Math,
        A = M.abs,
        line_num = 500,
        line_len = 10,
        heads = [],
        tails = [],
        hole, hole_target;

    function r(n) {
        return M.floor(M.random() * n);
    }

    function n(a, b, c) {
        return a < b ? a + c : a - c;
    }

    function p(x, y, v) {
        return {
            x: x,
            y: y,
            v: v || 1,

            dist: function (t) {
                var s = this,
                    dx = s.x - t.x,
                    dy = s.y - t.y;
                return M.sqrt(dx * dx + dy * dy);
            },

            move_to: function (t) {
                var s = this,
                    x = s.x,
                    y = s.y,
                    v = s.v,
                    q = t.x,
                    z = t.y,
                    a = A(x - q),
                    b = A(y - z),
                    k = b / a,
                    vk = a >= b ? v * k : v / k;

                if (a <= v && b <= v) return true;
                if (a >= b) {
                    s.x = n(x, q, v);
                    s.y = n(y, z, vk)
                }
                else {
                    s.x = n(x, q, vk);
                    s.y = n(y, z, v)
                }
                return false;
            },

            chase: function (t, d) {
                var s = this;
                if (s.dist(t) >= d) return s.move_to(t);
                return false;
            },

            rotate_to: function (t) {
                var s = this,
                    a = t.x - s.x,
                    b = t.y - s.y,
                    o = M.PI / 0.3,
                    w = M.cos(o),
                    z = M.sin(o);

                return s.move_to(p(a * w - b * z + t.x, a * z + b * w + t.y));
            }
        };
    }

    function loop() {
        ctx.fillRect(0, 0, w, h);
        ctx.beginPath();

        if (hole.rotate_to(hole_target)) {
            hole_target.x = r(w);
            hole_target.y = r(h);
        }

        for (var i = 0; i < heads.length; i++) {
            var head = heads[i],
                tail = tails[i];

            tail.chase(head, line_len);

            if (head.rotate_to(hole)) {
                head.x = tail.x = r(w);
                head.y = tail.y = r(h);
            }

            ctx.moveTo(head.x, head.y);
            ctx.lineTo(tail.x, tail.y);
        }

        ctx.closePath();
        ctx.stroke();

        setTimeout(loop, 33);
    }


    //Initialization
    (function () {
        canvas.style.cssText = "position:absolute;left:0;top:0";
        ctx.strokeStyle = '#f0f';

        hole = p(w / 2, h / 2, 4);
        hole_target = p(w / 2, h / 2);

        for (var i = 0; i < line_num; i++) {
            var x = r(w),
                y = r(h);
            heads.push(p(x, y, 2 + r(10)));
            tails.push(p(x, y, heads[i].v));
        }

        loop();
    })();
})();

// JS demo
var c = document.getElementById('c')
var grid = []

c.width = 500; c.height = 500
var ctx = c.getContext('2d')

var easeInCubic= function (x, t, b, c, d) {
    return c*(t/=d)*t*t + b
}

var easeOutBounce= function (x, t, b, c, d) {
    if ((t/=d) < (1/2.75)) {
        return c*(7.5625*t*t) + b
    } else if (t < (2/2.75)) {
        return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b
    } else if (t < (2.5/2.75)) {
        return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b
    } else {
        return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b
    }
}

var draw = function() {
    ctx.clearRect(0,0,500,500)
    
    for(var j=0; j<9; j++) {
        for(var i=0; i<9; i++) {
        
            var x = i*40+((9-j)*20)-(i*20), y = j*10 + 100 + (i*10)
            
            if(grid[i] && grid[i][j]) {
                t = grid[i][j]
                if(t<50) {
                    t++
                    y = easeInCubic(0, t, y, -50, 50)
                } else if(t<100) {
                    t++
                    y = easeOutBounce(0, t-50, y-50, 50, 50)
                }
                if(t==100) {
                    grid[i][j]=0
                } else {
                    grid[i][j]=t
                }
            }
        
            ctx.beginPath()
            ctx.moveTo(x + 20, y + 20)
            ctx.lineTo(x + 20, y + 100)
            ctx.moveTo(x + 40, y + 10)
            ctx.lineTo(x + 40, y + 90)
            ctx.lineTo(x + 20, y + 100)
            ctx.lineTo(x, y + 90)
            ctx.lineTo(x, y + 10)
            ctx.fillStyle = 'rgba(100,' + Math.floor(255-16.5*i) + ',' + Math.floor(255-16.5*j) + ',.9)'
            ctx.fill()
            ctx.stroke()
            ctx.closePath()
        
            ctx.beginPath()
            ctx.moveTo(x, y + 10)
            ctx.lineTo(x + 20, y)
            ctx.lineTo(x + 40, y + 10)
            ctx.lineTo(x + 20, y + 20)
            ctx.lineTo(x, y + 10)
            ctx.fillStyle = 'rgba(35,' + (Math.floor(255-16.5*i)-65) + ',' + (Math.floor(255-16.5*j)-65) + ',.9)'                           
            ctx.fill()
            ctx.stroke()
            ctx.closePath()
        
        }
    }

}

c.onmousemove = function(e) {
    xmap = Math.ceil((e.offsetX + 2 * (e.offsetY || e.layerX) - 240 - 200) / 40)
    ymap = Math.ceil((e.offsetX - 2 * (e.offsetY || e.layerY) - 240 + 200) / -40) - 2
    
    if(!grid[xmap]) {
        grid[xmap] = []
    }
    if(!grid[xmap][ymap]) {
        grid[xmap][ymap] = 20
    }
}

// Run!
setInterval(draw, 10)

//  JS demo
var m_r=Math.random;var m_m=Math.min;function M(a,e,d){var b=this;b.x=a;b.y=e;b.r=d;b.ri=1/d;b.ix=m_r()*2-1;b.iy=m_r()*2-1;b.t=new Date().getTime();b.m=function(f,g){var j=(new Date().getTime()-b.t)/10;b.t+=j*10;if(b.x<0||b.x>f){b.ix*=-1;b.x+=b.ix}if(b.y<0||b.y>g){b.iy*=-1;b.y+=b.iy}b.x+=b.ix*j;b.y+=b.iy*j};return b}function d_b(b,g,a,f){q=ms.length;for(d=0;d<q;d++){b[d].m(a,f)}t_m=0.99;p=0;for(y=0;y<f;y++){for(x=0;x<a;x++){it=0;for(d=0;d<q;d++){m=b[d];it+=m.r/((x-m.x)*(x-m.x)+(y-m.y)*(y-m.y))}if(it>t_m){var e=(it-t_m)*2550;var d=g.data;d[p+0]=m_m(e*0.1,255);d[p+1]=m_m(e*0.2,255);d[p+2]=m_m(e*0.5,255);d[p+3]=m_m(e*0.15,255)}p=p+4}}return g}var c=document.getElementById("c");var w=320;var h=200;cx=c.getContext("2d");c.setAttribute("width",w);c.setAttribute("height",h);cs=c.style;cs.backgroundColor="black";cs.width="100%";cs.height="100%";var ms=[];for(var i=0;i<4;i++){ms.push(new M(m_r()*w,m_r()*h,w*5))}setInterval(function(){var a=cx.createImageData(w,h);a=d_b(ms,a,w,h);cx.putImageData(a,0,0)},1);

// JS demp
D=document,q=D.body,F=q.style,ge=D.getElementById("c"),e=ge.getContext("2d"),f=Math,G=f.PI,a=f.sin,d=f.cos,k=f.random,F.margin=0;F.overflow="hidden";z=ge.width=innerWidth;v=ge.height=innerHeight;e.fillRect(J=0,Q=0,z,v);c=R=I=1000;q.onclick=function(x){R=(x.clientX-z/2)/z*2;I=(x.clientY-v/2)/v*2;reset();};D.onkeypress=function(x){Q=(Q==0)?1:0;};function reset(x){if(x){R=k()-.5;I=k()-.5;}K=k();xD=d(2*K*G)/z*2;yD=a(2*K*G)/v*2;if(Q==0){e.fillStyle="rgba(0,0,0,.5)";e.fillRect(0,0,z,v);}};setInterval(function(V){if((R*R+I*I)>2){reset(1);}J++;j=(d(J/100)+1)*G;r=~~((d(2*K*G+j)+1)/2*255);g=~~((a(2*K*2*G+j)+1)/2*255);b=~~((-d(2*K*G+j)+1)/2*255);e.fillStyle="rgb("+r+","+g+","+b+")";R=R+xD;I=I+yD;r1=R;i1=I;i=0;while(f.sqrt(r1*r1+i1*i1)<2&&i<500){e.fillRect(r1*z/2+z/2,i1*v/2+v/2,2,2);r2=r1*r1-i1*i1+R;i2=2*r1*i1+I;r1=r2;i1=i2;i++;}if(Q==1){e.fillStyle="rgba(0,0,0,.1)";e.fillRect(0,0,z,v);}},1)

// JS Demo
(function() {                                            // Removed after compression
    var win             = window,
        math            = Math,                            // My shortcut globals:
        s               = math.sqrt,
        r               = math.random,
        c               = document.getElementById("c"),
        cx              = c.getContext("2d"),
        w               = win.innerWidth,
        h               = win.innerHeight,
        MAX_PARTICLES   = 700,                            // Application globals
        MAX_VELOCITY    = 75/1000,                        //(px/ms)
        states          = [],
        time            = new Date().getTime(),
        vv,vx,dt,tt,V,p1,                                // For compressor tool
        p2,R,dx,dy,dd,d,dvx,dvy,dvdv,cos1,
        sin1,dv_para,t,cos2,sin2,
        v1x_,v1y_,v2x_,v2y_,v1x,v1y,v2x,v2y,
        mr,v1x_prime,v2x_prime;
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Initialization:                                                                                                //
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    c.width         = w;
    c.height        = h;
    cx.fillStyle    = "rgb(122,0,25)";
    for(n=0; n<MAX_PARTICLES; n++) {
        vx        = -MAX_VELOCITY + 2*r()*MAX_VELOCITY;
        vv        = s(MAX_VELOCITY*MAX_VELOCITY - vx*vx);
        states[n] = {
            r:    1+r()*10,
            px:   r()*w,
            py:   r()*h,
            vx:   vx,
            vy:   -vv+2*r()*vv
        };
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // The main loop:                                                                                                //
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    window.setInterval(function() {
        dt      = new Date().getTime() - time;
        time   += dt;                            // Ha-ha! #Desperation [time + dt = time + new time - time = new time] 
        
        cx.clearRect(0, 0, w, h);
        
        for(n=0; n<MAX_PARTICLES; n++) {
            tt       = dt;
            p1       = states[n];
            p1.px   += p1.vx*tt;
            p1.py   += p1.vy*tt;

            // Check boundaries first
            if(p1.px<p1.r||p1.px>w-p1.r){p1.vx=-p1.vx;p1.px=p1.px<p1.r?p1.r:w-p1.r;}
            if(p1.py<p1.r||p1.py>h-p1.r){p1.vy=-p1.vy;p1.py=p1.py<p1.r?p1.r:h-p1.r;}
            
            // Could it hit another particle?
            for(m=n+1; m<MAX_PARTICLES; m++) {
                p2           = states[m];
                R            = p1.r+p2.r;
                dx           = p2.px-p1.px;
                dy           = p2.py-p1.py;
                dd           = dx*dx+dy*dy;
                d            = s(dd);
                
                // Removed a lot of unnecessary checks here to make this smaller but less accurate.
                if(d<R) {
                    dvx          = p2.vx-p1.vx;
                    dvy          = p2.vy-p1.vy;
                    dvdv         = dvx*dvx+dvy*dvy;
                    cos1         = dx/d;
                    sin1         = dy/d;
                    dv_para      = dvx*cos1+dvy*sin1;
                    v1x          = p1.vx*cos1+p1.vy*sin1;
                    v1y          = p1.vy*cos1-p1.vx*sin1;
                    v2x          = p2.vx*cos1+p2.vy*sin1;
                    v2y          = p2.vy*cos1-p2.vx*sin1;
                    mr           = p2.r/p1.r;
                    V            = (v1x+mr*v2x)/(1+mr);
                    v1x_prime    = V-s(V*V-((1-mr)*v1x+2*mr*v2x)*v1x/(1+mr));
                    v2x_prime    = v1x/mr+v2x-v1x_prime/mr;

                    p1.vx        = v1x_prime*cos1-v1y*sin1;
                    p1.vy        = v1y*cos1+v1x_prime*sin1;
                
                    p2.vx        = v2x_prime*cos1-v2y*sin1;
                    p2.vy        = v2y*cos1+v2x_prime*sin1;
                }
            }
            
            // New all time low: draw inside collision method! >ugh<
            cx.beginPath();
            cx.arc(p1.px, p1.py, p1.r, 0, 2*math.PI, true);
            cx.fill();
        }
    }, 33);

})();

// JS demo
var a=document.getElementById("c"),b,c,d,e,f=8,h=600,i=300,j=30,k=j*0.95,l,m=[],n=Math,o,p,q,r,s,t,u,v,w,x,y,z,A;for(d=0;d<256;d++){b=d%16;c=~~(d/16);o=f-n.abs(f-b-0.5)+f-n.abs(f-c-0.5)-1;m[o]||(m[o]=[]);m[o].push({x:b,y:c,c:1,a:1})}a.height=a.width=h;a=a.getContext("2d");a.d=a.moveTo;a.b=a.lineTo;a.a=a.setTransform;a.e=a.beginPath;a.f=a.closePath;a.c=a.fill;B();function B(){a.a(1,0,0,1,0,0);a.clearRect(0,0,h,h);for(d=0;m[d];){for(e=0;m[d][e];){l=m[d][e];b=l.x;c=l.y;p=b-f;q=c-f;r=p+1;s=q+1;t=j*r;u=j*q;v=k*r;w=k*q;x=k*s;y=j*s;z=j*p;A=k*p;l.c+=(n.random()-l.a*0.5)*0.2;l.a-=(l.a-l.c)*0.01;l.a=l.a<0.1?0.1:l.a;a.a(l.a,0,0,l.a,i,i);C(l.a,0.4);a.e();if(b<f){a.d(t,u);a.b(v,w);a.b(v,x);a.b(t,y)}else{a.d(z,u);a.b(A,w);a.b(A,x);a.b(z,y)}a.f();a.c();a.e();if(c<f){C(l.a,0.6);a.d(t,y);a.b(v,x);a.b(A,x);a.b(z,y)}else{C(l.a,0.2);a.d(t,u);a.b(v,w);a.b(A,w);a.b(z,u)}a.f();a.c();C(l.a,0.5);a.fillRect(z,u,j,j);e++}d++}setTimeout(B,1)}function C(D,E){g=1-D*E;g=g<0.1?0.1:g>1?1:g;g=~~(g*255);a.fillStyle="rgb(0,"+g+","+g+")"};

// JS DEMO
/*
Copyright (c) 2010 Yuri Ivatchkovitch - http://sites.google.com/site/holycaffeine/

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

var doc = document;
var canvas = doc.getElementById( 'c' );
var context = canvas.getContext( '2d' );
var width = canvas.width = window.innerWidth - 21;
var height = canvas.height = window.innerHeight - 21;
var max_particles = width * height / 810;
var particles = [];
var math = Math;
var rnd = math.random;
var max = math.max;
var min = math.min;
var i = 0;
var functions = ['sin','cos','tan'];
var fnx = math['sin'];
var fny = math['sin'];

doc.onmousedown = function() 
{
  fnx = math[functions[( rnd() * functions.length ) | 0 ] ];
  fny = math[functions[( rnd() * functions.length ) | 0 ] ];
};

doc.bgColor = '#000';

while ( particles.length < max_particles )
{
  particles.push( { x: ( rnd() * width ) | 0, y: ( rnd() * height ) | 0, vx: 0, vy: 0 });
}

function x_movement_fn( particle )
{
  return fnx( particle.y / 25 ) - 0.5;
}

function y_movement_fn( particle )
{
  return fny( particle.x / 25 ) - 0.5;
}

function update( )
{
  var p = particles[ i ];
  
  p.vy = y_movement_fn( p );
  p.vx = x_movement_fn( p );
  
  p.x += p.vx;
  p.y += p.vy;
  
  if ( p.x < 0 )  
  {
    p.x = width + p.x;
  }
  else if ( p.x >= width )
  {
    p.x -= width;
  }

  if ( p.y < 0 )
  {
    p.y = height + p.y;
  }
  else if ( p.y >= height )
  {
    p.y -= height;
  }
}

function clamp_str( v )
{
  return ( min( max( v, 0 ), 1 ) * 255 ) | 0;
}

function draw( )
{
  
  var p = particles[ i ];
  var c = 'rgb(' + clamp_str( p.x / width )+ ',' + clamp_str( p.vx * p.vx + p.vy * p.vy ) + ',' + clamp_str( p.y / height ) +')';
  context.fillStyle = c;
  
  context.beginPath();
  context.arc( p.x, p.y, 5 / max( ( p.vx * p.vx + p.vy * p.vy ), 0.5 ), 0, 2 * math.PI, 0 );
  context.closePath();
  context.fill();
}

setInterval(
    function()
  {
  
  context.fillStyle = 'rgba(0,0,0,0.01)';
  context.fillRect( 0, 0, width, height );
    for ( i = 0; i < max_particles; i++ )
    {
      update( );
      draw( );
    }
  },
  10
) 

// JS demo
docbody = document.body;
context = docbody.children[0].getContext('2d');
context.shadowBlur = 3;
mousep=-1;          // mouse position (in blocks)
w = 8*2;            // board width and block size
v = w*w;            // displayed board width
k = 8*w;
board = [];         // game board
marked = [];        // marked blocks
Y=localStorage;
if(!Y.sh) Y.sh = 0; // high score :D

// setup new game
setup = function()
{
  offset = 0; // colums removed
  delta  = 0; // move score
  score  = 0; // total score
  end    = 0; // game over
  left   = v; // blocks left * 2
  // setup board and marks
  for(i=0; i<k; i++)
    // (x+'')[0] ^= Math.floor(x) for 0 <= x < 10
    board[i] = (Math.random()*4+1+'')[marked[i] = 0]
};


// draw board including highlighting
print = function()
{
  // clear board and score
  context.fillStyle = context.shadowColor = '#fff';
  context.fillRect(0,0,2*v,v);

  // print score + delta
  context.fillStyle = b = '#000';
  i = (a = ' Score: ')+score;
  if(end) i = 'Final'+i;
  if(delta) i += ' | '+delta;
  context.fillText(i,1,k+w);

  // print high score
  context.fillText(i='High'+a+Y.sh,v-context.measureText(i).width+4,k+w);

  // print separator
  context.fillRect(2,k+4,v+4,1);

  // draw board (-1 - marked, 0 - unmarked)
  for(c=-1;c<1;c++)
    for(i in board)
      if(board[i] && c==marked[i]) {
        // hint: colors are interlaced
        context.fillStyle = a = '#'+'#eb2290'.substr(board[i],3);
        context.shadowColor = c ? a : b;
        context.fillRect((i>>3)*w+4+offset,i%8*w+4,w,w);
      }
};


// mark highlighted blocks
// x,y - mouse position
mark = function(x,y)
{
  // check bounds and if already marked
  if(x>=0 && x<w && y>=0 && y<8 && board[i=x*8+y] && board[i]==board[mousep] && !marked[i]) {
    marked[i] = -1; // -1 is cheaper than 1
    // mark next positions
    for(var c=-1; c<3;) 
      mark(c%2+x,(1-c++)%2+y);
    numMarked++
  }
};


// move handler
docbody.onmouseover =
docbody.onmousemove = function(e)
{
  // map to board
  x = e.pageX-4-offset >> 4;
  y = e.pageY-4 >> 4;
  // don't select after game end or if block already selected
  if(!end && x*8+y-mousep) {
    // unmark
    for(i in board)
      marked[i] = 0;

    // remember position
    mousep = x*8+y;

    // mark new blocks
    numMarked = 0;
    mark(x,y);
    if(numMarked<2) marked[mousep] = 0;

    print()
  }
};


// click handler
docbody.onclick = function(e)
{
  if(end) setup();
  if(!end && numMarked-1) {
    // score: (n-1)^2 for n blocks
    delta = numMarked-1;
    delta *= delta;

    // remove marked blocks
    for(i in board)
      if(marked[i]) {
        board[i] = 0;
        marked[i] = 0;
        left -= 2;
      }

    b = k;
    // block propagation
    for(x=numMarked=0; x<k;x+=8) {
      // vertical
      // hint: a has 2 uses here, do not touch ;)
      for(a=0;!a;)
        for(i=a=x+8-1; i>x; i--)
          if(!board[i] && board[i-1]) {
            board[i] = board[i-1];
            board[i-1] = 0;
            a = 0;
          }
      // horizontal
      if(board[a]) {
        if(x>b)
          for(i=x; i<8+x; board[i++]=0)
            board[b++] = board[i]
      }
      else if(x<b)
        b = x;
    }

    // count remaining columns for offset
    offset = k-b;

    // end check
    end = -1;
    for(i in board)
      if(board[i] && (i%8 && board[i-1]==board[i] || i>8 && board[i-8]==board[i]))
        end = 0;
  
    // game end score: -blocks*2
    delta += end*left;

    // add score
    score += delta;

    // highscore
    if(end && score>Y.sh) Y.sh = score
  }
  // mark next blocks immediately
  mousep = -1;
  docbody.onmousemove(e);
  print()
};

setup();
print()

// JS demo
X = document.getElementById('c');
R = X.width = X.height = 600;
Q = 300;
X = X.getContext('2d');
X.strokeStyle='green';
X.translate(Q,Q);
H=.5;
M = Math;
C = M.cos;
S = M.sin;
P = M.PI/2;
F = 'window.onkeyup=function(e){t=e.keyCode-31;l=t-6?t-8?l:0:-0;f=t-7?t-9?f:-0:0;t==0?[g[1]=x,g[2]=y,a=S(r),b=C(r)]:0};';
B = 'a=b=p=l=f=r=x=y=0;o=[[c=[-.1],g=[0,R,R],d=[.1]]];for(i=14;i+16;i--){t=M.floor(M.random()*30);for(j=4;j;j--){o.push([[-H,i+H,t+H],[H,j&2?i+1:i,j+1&2?t+1:t],[H,j+1&2?i+1:i,j&2?t:t+1]]);}}T();';
eval(F.replace('up','down').replace(/0/g,1)+F+B);

function T(){
  p += t = new Date().getTime()-p;
  t = p-t?t/Q:(h=p)&0;
  r += t*l;
  r %= 4*P;
  x += S(r)*t*f;
  y += C(r)*t*f;
  c[1] = d[1] = g[1];
  c[2] = d[2] = g[2];
  g[1] += a*t*4;
  g[2] += b*t*4;
  X.fillRect(-Q,-Q,R,R);
  X.beginPath();
  for(i in o){
    for(j in o[i]){
      t = o[i][j];
      m = t[1]-x;
      n = t[2]-y;
      v = (S(r)*m+C(r)*n)/Q;
      m = S(r+P)*m+C(r+P)*n;
      if(j==0){
        s = t[1]-g[1];
        w = t[2]-g[2];
        v = i!=0&&s<H&&s>-H&&w<H&&w>-H?o.splice(i,4)&0:v;
        if(v<1/Q) break;
        X.moveTo(m/v,t[0]/v);
      }else X.lineTo(m/v,t[0]/v);
    }
  }
  X.stroke();
  if(o.length==1){alert(p-h);eval(B);}
  setTimeout(T,33);
}

// JS demo
m = Math;
// k = keyboard state object, reuse Math.abs to avoid an initializer
// so k() = Math.abs(), but k[keycode] = down state
k=m.abs;
// s = score
// q = quit, if 1 then game over
// g = rate counter to generate enemy fighters
g = s = q = 0;
r = 53; // generate a fighter every this many frames, 1 frame per 40 ms
// key state tracking
this.onkeydown = this.onkeyup = function(e) { 
  // which is shorter than keyCode
  k[e.which] = (e.type == 'keydown');
  if (k[32] & !q) { 
    // d: inverted x direction travelling speed
    f.push({x: p.x, y: p.y, s: 4, d: -3, b: 1});
  };
};

with(document.getElementById('c')) {
  style.border = 'inset #999';
  width = w = 350; height = h = 150;
  c = getContext('2d');
  // fighters
  // s: delta x for drawing
  p = {x: 10, y: h/2, s: 8}; // player 1
  f = []; // enemy fighters and bullets, bullets have b: 1
  
  with (f) {
    // d = draw item
    // p.s = scale factor for flipping rendering across the x axis
    function d(p) {
      c.beginPath();
      c.moveTo(p.x, p.y);
      x=p.x-p.s; v = p.b?1:5;
      c.lineTo(x, p.y+v);
      c.lineTo(x, p.y-v);
      c.fill();
    }
    setInterval(function() {
      l=length;
      // update the position of the main fighter
      p.x += k[39]?2:0; // right
      p.x -= k[37]?2:0; // left
      p.y -= k[38]?2:0; // up
      p.y += k[40]?2:0; // down
      // should we generate an enemy fighter and enemy bullets?
      // value is inverted: g=0 -> generate fighter
      g %= m.max(10, r-=0.02)|0; // slowly increase the rate of fighters
      // generate enemy fighter
      if (!g++) push({x: w, y: h*m.random(), s: -8, d: 1});
      // draw everything
      t = c.fillStyle = c.createLinearGradient(0,0,w,h);  
      t.addColorStop(0,'#170');
      t.addColorStop(1,'#010');  
      c.fillRect(0,0,w,h);
      c.fillStyle = '#3F1';
      i=l;
      while (i--) {
        // animate enemy fighters and bullets
        x = (o=f[i]).x -= o.d;
        // if this is a player 1 bullet, 
        // do collision detection against enemy fighters
        // o.d < 0: player 1 object
        if (o.b & o.d<0) {
          // for every enemy fighter
          j=l;
          while (j--) {
            z=f[j];
            // if collision, remove bullet and fighter and increase score
            // !z.b = not a bullet
            if (z && !z.b && k(x-z.x-4)<4 && k(z.y-o.y)<4) {
              if (i>j) i--;
              splice(j, 1);
              splice(i, 1);
              s++;
            };
          }; // end while (j--)
        };
        // do collision detection between player 1 and enemy objects
        // o.d>0 : enemy object
        if (!q && o.d>0 && k(p.x-x-6)<4 && k(o.y-p.y)<5) {
          q=1;
          splice(i, 1);
        };
        // if this is a fighter, and not a bullet, 
        // and it's time to fire bullets, then fire a bullet
        // x%h -> fire bullets every h pixels
        if (!(o.b | x%h)) push({x: x, y: o.y, s: -4, d: 2, b: 1});
        // remove them if they go out of the screen
        if (k(x) > w+9) splice(i, 1);
        // draw all items
        d(o);
      }; // end while (i--)
      if (!q) d(p);
      c.fillText(s, 2, h-2);
    }, 40);
  }
}

// JS demo
// a 1k cellula automata, based on Langton's Ant
// . http://en.wikipedia.org/wiki/Langton's_ant
// . http://www.paulhammond.org/2010/08/1k/

// this is a reworked version of my 2001 5k entry:
// . http://web.archive.org/web/20030101055404/www.the5k.org/description.asp/entry_id=549
// . http://www.paulhammond.org/2001/the5k/

// lookup:
// a   = 10
// b   = body
// c   = canvas
// d   = document
// e   = event
// f() = floor(x/10)
// g   = grid
// i   = iterator
// j   = iterator
// h   = height of grid (g[1].length)
// n   = "nodes" - array of [x,y,v]
// o   = e.pageX (used in c.onclick)
// r() = rectangle()
// t   = canvas.context
// w   = width of grid (g.length)
// z() = zoom!()

// to compress:
// perl -p -0 -e 's!(//[^\n]*)?\n\s*!!g;s!;}!}!g;s!;+!;!g' <script.js >compressed.js

function f(i){
  return (i-i%a)/a
}
// JS demo
c=document.getElementById('c')
width=500;
height=300;
c.width=width;
c.height=height;
c=c.getContext('2d')
key=[];
map=[];
map[0]=[1,1,1,1,1,1,1,1,1,1];
map[1]=[1,0,0,1,0,0,0,0,0,1];
map[2]=[1,0,1,1,1,0,1,1,0,1];
map[3]=[1,0,1,0,0,0,0,1,0,1];
map[4]=[1,0,0,0,1,1,1,1,0,1];
map[5]=[1,1,0,1,1,0,0,0,0,1];
map[6]=[1,0,0,1,0,0,1,1,1,1];
map[7]=[1,0,1,1,0,1,1,0,2,1];
map[8]=[1,0,0,1,0,0,0,0,0,1];
map[9]=[1,1,1,1,1,1,1,1,1,1];
posX=1;
posY=1;
dirX=1;
dirY=0;
rotateSpeed=0.2;
moveSpeed=0.2;
planeX=0;
planeY=0.56;

document.onkeydown=function(e) { key[e.keyCode]=1 }
document.onkeyup=function(e) { key[e.keyCode]=0 }

function renderScreen() {
for(var x=0; x<width; x++) {
  var cameraX=2*x/width - 1;
  var rayDirX=dirX+planeX*cameraX;
  var rayDirY=dirY+planeY*cameraX;
  var mapX=Math.floor(posX)
  var mapY=Math.floor(posY)
  var deltaDistX=Math.sqrt(1+(rayDirY*rayDirY)/(rayDirX*rayDirX));
  var deltaDistY=Math.sqrt(1+(rayDirX*rayDirX)/(rayDirY*rayDirY));
  var hit=0;
  var stepX=1;
  var stepY=1;
  var sideDistX=(mapX+1-posX)*deltaDistX;
  var sideDistY=(mapY+1-posY)*deltaDistY;
  if(rayDirX<0) {
    stepX=-1;
    sideDistX=(posX-mapX)*deltaDistX;
  }
  if(rayDirY<0) {
    stepY=-1;
    sideDistY=(posY-mapY)*deltaDistY;
  }
  while(!hit) {
    var side=0;
    if(sideDistX<sideDistY) {
      sideDistX+=deltaDistX;
      mapX+=stepX;  
    } else {
      sideDistY+=deltaDistY;
      mapY+=stepY;
      side=1;
    }
    if(map[mapX][mapY]>0) hit=1;
  }
  var perpWallDist=(mapY-posY+(1-stepY)/2)/rayDirY;
  if(side==0) perpWallDist=(mapX-posX+(1-stepX)/2)/rayDirX;
  perpWallDist+=0.01;
  var wallHeight=height/perpWallDist;
  var drawStart=-wallHeight/2+height/2;
  var drawEnd=wallHeight/2+height/2;
  c.strokeStyle='rgb(0,0,'+Math.floor(lineHeight)+')';
  c.beginPath()
  c.moveTo(x, drawStart)
  c.lineTo(x, drawEnd)
  c.stroke()
}
}
function handleMovement() {
    c.clearRect(0,0,width,height)
  if(key[38]) {
    if(map[Math.floor(posX+dirX*moveSpeed)][Math.floor(posY)]=='0') posX+=dirX*moveSpeed;
    if(map[Math.floor(posX)][Math.floor(posY+dirY*moveSpeed)]=='0') posY+=dirY*moveSpeed;
  }
  if(key[37]) {
    oldDirX=dirX;
    dirX=dirX*Math.cos(-rotateSpeed)-dirY*Math.sin(-rotateSpeed);
    dirY=oldDirX*Math.sin(-rotateSpeed)+dirY*Math.cos(-rotateSpeed);
    oldPlaneX=planeX;
    planeX=planeX*Math.cos(-rotateSpeed)-planeY*Math.sin(-rotateSpeed);
    planeY=oldPlaneX*Math.sin(-rotateSpeed)+planeY*Math.cos(-rotateSpeed);
    }
    if(key[39]) {
    oldDirX=dirX;
    dirX=dirX*Math.cos(rotateSpeed)-dirY*Math.sin(rotateSpeed);
    dirY=oldDirX*Math.sin(rotateSpeed)+dirY*Math.cos(rotateSpeed);
    oldPlaneX=planeX;
    planeX=planeX*Math.cos(rotateSpeed)-planeY*Math.sin(rotateSpeed);
    planeY=oldPlaneX*Math.sin(rotateSpeed)+planeY*Math.cos(rotateSpeed);
    }
  renderScreen()
}
setInterval(handleMovement, 30)

function r(x,y,i){
  t.fillStyle='#'+i;
  t.fillRect(x*a+1,y*a+1,9,9);
}

var g=[],n=[],a=10,i,j,h=f(innerHeight-a),w=f(innerWidth),b=document.body,c=b.children[0],t=c.getContext('2d');

b.style.margin=0;b.bgColor='#333333';
c.width=a*w;c.height=a*h;

for(i=w;i-->0;){
  g[i]=[];
  for(j=h;j-->0;){
    g[i][j]=-1;
    r(i,j,'444')
  }
}

// G = this grid square
// N = this node info [x,y,dx,dy]
// x = y
// y = y
// v = direction ("velocity")
function z(){
  for(i=n.length;i-->0;){
    var N=n[i],x=N[0],y=N[1],v=N[2],G=g[x][y];
    r(x,y,G>0?'fff':'000');
    g[x][y]*=-1;
    x+=G*(1-v)%2;
    y+=G*(2-v)%2;
    v+=G;
    x=x<0?w-1:x%w;
    y=y<0?h-1:y%h;
    v=v<0?3:v%4;
    n[i]=[x,y,v];
    r(x,y,'fc0');
  }
  setTimeout(z,100);
}

c.onclick=function(e){
  x=f(e.pageX);
  if(x<w&&n.push([x,f(e.pageY),1])&&!n[1])z()
}


// JS demo
// Set up sin & cos tables
var sin=[], cos=[];
for (var angle=0; angle<361; angle++) {
  var angleRads = angle * Math.PI / 180;
  sin[angle] = Math.sin(angleRads);
  cos[angle] = Math.cos(angleRads);
}

// Set up ball data
var ballData = [];
var radius = 95;
var xSteps = 18;
var ySteps = 12;
var xAngle = 360 / xSteps
var yAngle = 180 / ySteps;

for (y=0; y<ySteps; y++) {
  for (x=0; x<xSteps; x++) {
    var x1 = x * xAngle;
    var y1 = y * yAngle;
    var x2 = x1 + xAngle;
    var y2 = y1 + yAngle;

    var sx1 = sin[x1];
    var cx1 = cos[x1];
    var sy1 = sin[y1];
    var cy1 = cos[y1];
    var sx2 = sin[x2];
    var cx2 = cos[x2];
    var sy2 = sin[y2];
    var cy2 = cos[y2];

    ballData.push([
      {
        x: radius * sy1 * cx1,
        y: radius * sy1 * sx1,
        z: radius * cy1,
        colour: (x + y) % 2 ? '#CC0000' : '#CCCCCC'
      },{
        x: radius * sy2 * cx1,
        y: radius * sy2 * sx1,
        z: radius * cy2
      },{
        x: radius * sy2 * cx2,
        y: radius * sy2 * sx2,
        z: radius * cy2
      },{
        x: radius * sy1 * cx2,
        y: radius * sy1 * sx2,
        z: radius * cy1
      }
    ])
  }
} 

// Set up canvas
var squaresAcross = 16;
var squaresDown = 12;
var squareWidth = 35;
var squareHeight = 35;
var borderWidth = 5;
var borderHeight = 5;
var canvasWidth = squaresAcross * squareWidth + borderWidth * 2;
var canvasHeight = squaresDown * squareHeight + borderHeight * 2;
var canvasEl = document.getElementById('c');
var ctx = canvasEl.getContext('2d');
canvasEl.width = canvasWidth;
canvasEl.height = canvasHeight;

// Draw chequerboard background
ctx.fillStyle = '#114488';
ctx.fillRect(0, 0, canvasWidth, canvasHeight);
ctx.fillStyle = '#3399CC';
for (y=0; y<squaresDown; y++) {
  for (x=y%2; x<squaresAcross; x+=2) {
    ctx.fillRect(x * squareWidth + borderWidth, y * squareHeight + borderHeight, squareWidth, squareHeight);
  }
};
var bg = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

// Set up ball position and movement variables
var ballX = radius + borderWidth;
var ballY = radius + borderHeight;
var xInc = yInc = 1;

// Convert 3D coordinates to 2D, taking into account rotation angle
function map3dCoordsTo2d(vertex) {
  x = vertex.x * cosX - vertex.y * sinX;
  y = vertex.x * sinX + vertex.y * cosX;
  z = vertex.z * cos[170] - x * sin[170];
  return ({
    x: vertex.z * sin[170] + x * cos[170] + ballX,
    y: y * cosX - z * sinX + ballY,
    z: y * sinX + z * cosX,
    colour: vertex.colour
  });
}

// Z-sorts 2 faces
function zSort(a, b) {
  var aHighestZ = Math.max(a[0].z, a[1].z);
  var bHighestZ = Math.max(b[0].z, b[1].z);
  return (aHighestZ - bHighestZ);     
}

// Blats the background, draws the ball
function render() {
  // Update rotation angles
  sinX = sin[ballX % 360];
  cosX = cos[ballX % 360];

  // Clear background
  ctx.putImageData(bg, 0, 0);

  // Draw shadow
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = '#000000';
  ctx.arc(ballX + radius / 3, ballY + radius / 10, radius, 0, Math.PI * 2, 0);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Map 3D to 2D coordinates, cull invisible faces, and z-sort remaining faces
  var sortedBallData = [];
  for (var faceLoop=0; faceLoop<ballData.length; faceLoop++) {
    var face = ballData[faceLoop];
    var mappedFace = [];
    for (vertexLoop=0; vertexLoop<face.length; vertexLoop++) {
      var mappedVertex = map3dCoordsTo2d(face[vertexLoop]);
      mappedFace.push(mappedVertex);
    }
    if (mappedFace[0].z < 0 && mappedFace[1].z < 0 && mappedFace[2].z < 0 && mappedFace[3].z < 0) continue;
    sortedBallData.push(mappedFace);
  }

  sortedBallData.sort(zSort);

  for (var faceLoop=0; faceLoop<sortedBallData.length; faceLoop++) {
    var face = sortedBallData[faceLoop];
    ctx.fillStyle = face[0].colour;
    ctx.beginPath();
    ctx.moveTo(face[0].x, face[0].y);
    for (vertexLoop=1; vertexLoop<face.length; vertexLoop++) {
      ctx.lineTo(face[vertexLoop].x, face[vertexLoop].y);
    }
    ctx.closePath();
    ctx.fill();
  }

  ballX += xInc;
  ballY += yInc;
  if (ballX + radius > canvasWidth - borderWidth) xInc = -1;
  if (ballX - radius == borderWidth) xInc = 1;
  if (ballY + radius > canvasHeight - borderHeight) yInc = -1;
  if (ballY - radius == borderHeight) yInc = 1;

  setTimeout(render, 1);
}

render();


// JS demo
with(document.body.style){margin="0px";overflow="hidden";}var w=window.innerWidth;var h=window.innerHeight;var ca=document.getElementById("c");ca.width=w;ca.height=h;var c=ca.getContext("2d");m=Math;fs=m.sin;fc=m.cos;fm=m.max;setInterval(d,30);function p(x,y,z){return{x:x,y:y,z:z};}function s(a,z){r=w/10;R=w/3;b=-20*fc(a*5+t);return p(w/2+(R*fc(a)+r*fs(z+2*t))/z+fc(a)*b,h/2+(R*fs(a))/z+fs(a)*b);}function q(a,da,z,dz){var v=[s(a,z),s(a+da,z),s(a+da,z+dz),s(a,z+dz)];c.beginPath();c.moveTo(v[0].x,v[0].y);for(i in v)c.lineTo(v[i].x,v[i].y);c.fill();}var Z=-0.20;var t=0;function d(){t+=1/30.0;c.fillStyle="#000";c.fillRect(0,0,w,h);c.fillStyle="#f00";var n=30;var a=0;var da=2*Math.PI/n;var dz=0.25;for(var z=Z+8;z>Z;z-=dz){for(var i=0;i<n;i++){fog=1/(fm((z+0.7)-3,1));if(z<=2){fog=fm(0,z/2*z/2);}var k=(205*(fog*Math.abs(fs(i/n*2*3.14+t))))>>0;k*=(0.55+0.45*fc((i/n+0.25)*Math.PI*5));k=k>>0;c.fillStyle="rgb("+k+","+k+","+k+")";q(a,da,z,dz);if(i%3==0){c.fillStyle="#000";q(a,da/10,z,dz);}a+=da;}}Z-=0.05;if(Z<=dz)Z+=dz;}

var log = function(exp) {
  console.log(exp);
}

// Module pattern
var counter = (function(){
    var i = 0;

    return {
      get: function(){
        return i;
      },
      set: function(val){
        i = val;
      },
      increment: function() {
        return ++i;
      }
    };
  }());

log(counter.get())
counter.set(5)
log(counter.get())


// Recursion
function yell(n){ 
  if (n > 0) {
    return yell(n-1) + "a"
  } else {
    return "hiy"
  }
} 

console.log(yell(3))

// Quine
!function $(){console.log('!'+$+'()')}()

// OO
function extend(target, source) {
  Object.getOwnPropertyNames(source).forEach(function(propName) {
    Object.defineProperty(target, propName,
      Object.getOwnPropertyDescriptor(source, propName));
  });
  return target;
}

function inherits(SubC, SuperC) {
    var subProto = Object.create(SuperC.prototype);
    extend(subProto, SubC.prototype);
    SubC.prototype = subProto;
    SubC._super = SuperC.prototype;
};

function Animal(x) {
  var name = x
  this.__defineGetter__('name', function() {
    return name;
  })
 }

var a = new Animal('Bambi')
console.log(a.name)



function Person() {
  var args = arguments[0]

  for (arg in args) {
    this[arg] = args[arg]
  }
}

inherits(Person, Animal)

var users = []
users.push(new Person({ name: 'Andy', title: 'Mr.' }))
users.push(new Person({ name: 'June', title: 'Mrs.' }))

var returnValue = function(name) {
  return function(obj) {
    return obj[name]
  }
}

log(users.map(returnValue('type')))
log(users.map(returnValue('name')))
log(users[0])