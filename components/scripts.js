exports.Scripts = {
  fetchData: `
    function main() {
      var data = {shared_data:{post_url:null, img_url:null, media_url:null, video_view_count:null, height:null, width:null, username:null, pp_url:null, is_private:null, is_verified:null, likes_count:null, comments_count:null, caption:null, sidecar:[]}, success:false}

      if(window.top === window){
        try{
          //setData
          data.success = true;
        }catch(_){
          data.success = false;
        }
        window.ReactNativeWebView.postMessage(JSON.stringify(data));
      };
    }
    window.onload = main;
  `,
  fetchData__a: `
    var data = {shared_data:{post_url:null, img_url:null, media_url:null, video_view_count:null, height:null, width:null, username:null, pp_url:null, is_private:null, is_verified:null, likes_count:null, comments_count:null, caption:null, sidecar:[]}, success:false}
    if(document.URL){
      try{
        var sharedData = JSON.parse(document.getElementsByTagName("pre")[0].innerText)

        data.shared_data.img_url = sharedData.graphql.shortcode_media.display_resources[2].src;
        data.shared_data.media_url = sharedData.graphql.shortcode_media.is_video ? sharedData.graphql.shortcode_media.video_url : sharedData.graphql.shortcode_media.display_resources[2].src
        data.shared_data.video_view_count = sharedData.graphql.shortcode_media.video_view_count ? sharedData.graphql.shortcode_media.video_view_count : null;
        data.shared_data.height = sharedData.graphql.shortcode_media.display_resources[2].config_height;
        data.shared_data.width = sharedData.graphql.shortcode_media.display_resources[2].config_width;
        data.shared_data.username = sharedData.graphql.shortcode_media.owner.username;
        data.shared_data.pp_url = sharedData.graphql.shortcode_media.owner.profile_pic_url;
        data.shared_data.is_private = sharedData.graphql.shortcode_media.owner.is_private;
        data.shared_data.is_verified = sharedData.graphql.shortcode_media.owner.is_verified;
        data.shared_data.likes_count = sharedData.graphql.shortcode_media.edge_media_preview_like.count;
        data.shared_data.comments_count = sharedData.graphql.shortcode_media.edge_media_preview_comment.count;
        data.shared_data.caption = sharedData.graphql.shortcode_media.edge_media_to_caption.edges[0] ? sharedData.graphql.shortcode_media.edge_media_to_caption.edges[0].node.text : null;
        data.shared_data.post_url = "https://www.instagram.com/p/" + sharedData.graphql.shortcode_media.shortcode;

        data.success = true;
        window.ReactNativeWebView.postMessage(JSON.stringify(data));
      }catch(_){
        data.success = false;
        window.ReactNativeWebView.postMessage(JSON.stringify(data));
      }
    }
  `,
  fetchUserDetails: `
    function main() {
      var data = {user_data:{username:null, pp_url:null, follwers_count:null, following_count:null, user_id:null, is_private:null, is_verified:null}, success:false}

      if(window.top === window){
        try{
          //setData
          data.success = true;
        }catch(_){
          data.success = false;
        }
        window.ReactNativeWebView.postMessage(JSON.stringify(data));
      };
    }
    window.onload = main;
  `,
  fetchUserDetails__a: `
    var data = {user_data:{username:null, pp_url:null, followers_count:null, following_count:null, user_id:null, is_private:null, is_verified:null}, success:false};

    async function getData(){
      if(document.URL){
        try{
          let username_data = JSON.parse(document.getElementsByTagName("pre")[0].innerText);
          var username = username_data.form_data.username;
  
          data.user_data.username = username;
  
          let raw_user_data = await fetch('https://www.instagram.com/'+ username +'/?__a=1');
          var user_data_json = await raw_user_data.json();
  
          data.user_data.pp_url = user_data_json.graphql.user.profile_pic_url;
          data.user_data.followers_count = user_data_json.graphql.user.edge_followed_by.count;
          data.user_data.following_count = user_data_json.graphql.user.edge_follow.count;
          data.user_data.user_id = user_data_json.graphql.user.id;
          data.user_data.is_private = user_data_json.graphql.user.is_private;
          data.user_data.is_verified = user_data_json.graphql.user.is_verified;
          data.success = true;
        }catch(_){}
        window.ReactNativeWebView.postMessage(JSON.stringify(data));
      }
    }

    if (document.readyState==="complete") {
      getData()
    } else {
      window.onload = getData;
    }

  `,
};
