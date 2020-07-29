exports.Scripts = {
  fetchData: `
    function main() {
      var data = {shared_data:{post_url:null, img_url:null, media_url:null, video_view_count:null, height:null, width:null, username:null, pp_url:null, is_private:null, is_verified:null, likes_count:null, comments_count:null, caption:null, sidecar:[]}, success:false}

      if(window.top === window){
        try{
          data.shared_data.img_url = _sharedData.entry_data.PostPage[0].graphql.shortcode_media.display_resources[2].src;
          data.shared_data.media_url = _sharedData.entry_data.PostPage[0].graphql.shortcode_media.is_video ? _sharedData.entry_data.PostPage[0].graphql.shortcode_media.video_url : _sharedData.entry_data.PostPage[0].graphql.shortcode_media.display_resources[2].src
          data.shared_data.video_view_count = _sharedData.entry_data.PostPage[0].graphql.shortcode_media.video_view_count ? _sharedData.entry_data.PostPage[0].graphql.shortcode_media.video_view_count : null;
          data.shared_data.height = _sharedData.entry_data.PostPage[0].graphql.shortcode_media.display_resources[2].config_height;
          data.shared_data.width = _sharedData.entry_data.PostPage[0].graphql.shortcode_media.display_resources[2].config_width;
          data.shared_data.username = _sharedData.entry_data.PostPage[0].graphql.shortcode_media.owner.username;
          data.shared_data.pp_url = _sharedData.entry_data.PostPage[0].graphql.shortcode_media.owner.profile_pic_url;
          data.shared_data.is_private = _sharedData.entry_data.PostPage[0].graphql.shortcode_media.owner.is_private;
          data.shared_data.is_verified = _sharedData.entry_data.PostPage[0].graphql.shortcode_media.owner.is_verified;
          data.shared_data.likes_count = _sharedData.entry_data.PostPage[0].graphql.shortcode_media.edge_media_preview_like.count;
          data.shared_data.comments_count = _sharedData.entry_data.PostPage[0].graphql.shortcode_media.edge_media_preview_comment.count;
          data.shared_data.caption = data.shared_data.caption = _sharedData.entry_data.PostPage[0].graphql.shortcode_media.edge_media_to_caption.edges[0] ? _sharedData.entry_data.PostPage[0].graphql.shortcode_media.edge_media_to_caption.edges[0].node.text : null;
          data.shared_data.post_url = "https://www.instagram.com/p/"+_sharedData.entry_data.PostPage[0].graphql.shortcode_media.shortcode;

          data.success = true;
        }catch(_){
          data.success = false;
        }
        window.ReactNativeWebView.postMessage(JSON.stringify(data));
      };
    }
    window.onload = main;
`,
  fetchBase64: `  
    // window.ReactNativeWebView.postMessage("base64");
    // window.ReactNativeWebView.postMessage(c.toDataURL());
    setTimeout(() => {
      // base64 = c.toDataURL("image/png")
      // window.ReactNativeWebView.postMessage("base64");
      window.ReactNativeWebView.postMessage(c.toDataURL());
    }, 2000);
    
  `,
};
exports.rCanvas = (postURL, username) => {
  return `<html>
    <body style="margin: 0em; padding: 0em; margin: 0em;">
      <canvas
        id="PostPreviewCanvas"
        width="512"
        height="512"
        style="margin: 0em; padding: 0em; margin: 2em;"
        >Your browser does not support the HTML canvas tag.</canvas
      >
  
      <script>
        const postURL = "${postURL}";
        const usrnm = "dust.speck";
  
        var c = document.getElementById("PostPreviewCanvas");
        var ctx = c.getContext("2d");
  
        var thumbnail = new Image();
        thumbnail.src = postURL;
        thumbnail.crossOrigin = "Anonymous";
        thumbnail.setAttribute('crossOrigin', 'anonymous');
  
        W = window.innerWidth;
        H = window.innerHeight;
          
        c.width = W;
        c.height = H;
  
        [iW, iH, aW, aH, aX, aY] = [0];
        [bX1, bY1, bX2, bY2] = [0];
        [tX, tY] = [0];
  
        calcImgDim = () => {
          iW = thumbnail.width;
          iH = thumbnail.height;
          if (iW > iH) {
            aW = W;
            aH = (W / iW) * iH;
          } else if (iH > iW) {
            aH = H;
            aW = (H / iH) * iW;
          } else {
            if (W > H) {
              aH = H;
              aW = (H / iH) * iW;
            } else {
              aW = W;
              aH = (W / iW) * iH;
            }
          }
          aW*=0.9;
          aH*=0.9;

          aX = (W - aW) / 2;
          aY = ((H - aH) / 2)+100;
        };
        drawBgDim = () => {
          bX1 = aX;
          bY1 = aY - 150;
          bX2 = aW;
          bY2 = aY;
          ctx.beginPath();
          ctx.rect(bX1, bY1, bX2, bY2);
          ctx.fillStyle = "black";
          ctx.fill();
        };

        writeUsrn = () => {
          ctx.fillStyle = "white";
          ctx.textAlign='start';
          ctx.textBaseline='middle';
          ctx.font = "50px Roboto";
          tX = ((bX2 - bX1)/4);
          tY = (bY1 + bY2)/2;
          console.log(bX1, tY);
          ctx.fillText("${username}", tX, tY);
        };

        writeB64 = () => {
          ctx.fillStyle = "black";
          ctx.textAlign = "start";
          ctx.textBaseline = "middle";
          ctx.font = "40px Roboto";
          tX = -500;
          tY = H / 2;
          let a = 'data:'
          try{
            a+= c.toDataURL();
          }catch(e){
            a+=e;
          }
          ctx.fillText(a, tX, tY);
        };
  
        thumbnail.onload = function () {
          calcImgDim();
          drawBgDim();
          ctx.drawImage(thumbnail, aX, aY, aW, aH);
          writeUsrn();
          writeB64();
          window.ReactNativeWebView.postMessage(c.toDataURL());
        };
      </script>
    </body>
  </html>
  `;
};
