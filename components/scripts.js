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
    setTimeout(() => {
      window.ReactNativeWebView.postMessage(c.toDataURL());
    }, 2000);
    
  `,
  fetchUserDetails: `
    function main() {
      var data = {user_data:{username:null, pp_url:null, follwers_count:null, following_count:null, user_id:null, is_private:null, is_verified:null}, success:false}

      if(window.top === window){
        try{
          // data.user_data.username = _sharedData.entry_data.ProfilePage[0].graphql.user.username
          data.user_data.username = _sharedData.config.viewer.username
          data.user_data.pp_url = _sharedData.config.viewer.profile_pic_url
          data.success = true;
        }catch(_){
          data.success = false;
        }
        window.ReactNativeWebView.postMessage(JSON.stringify(data));
      };
    }
    window.onload = main;
  `,
};
