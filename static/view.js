/** @jsx React.DOM */
$(function(){

  var ImageBox = React.createClass({
    loadCommentsFromServer: function(){
      $.getJSON(this.props.url, function(data){
        this.setState({images: data.slice(0,5)});
        }.bind(this)
      );
    },
    getInitialState: function() {
      return {};
    },
    componentWillMount: function() {
      this.loadCommentsFromServer();
      setInterval(this.loadCommentsFromServer, this.props.refreshRate);
    },
    render: function(){
      if($.isEmptyObject(this.state)){
        return (
          <div className="loading">
            Loading
          </div>
        );
      }
      var that = this,
          images;

      images = $.map(this.state.images, function(image, i){

        var toggleComments = function(){
          image.comments.show_comments = !image.comments.show_comments;
          that.forceUpdate();
        };

        return (
          <div className="image_container" style={{height: $(window).height()}}
            onClick={toggleComments}>
            <div className="main_image">
              <ImageView images={image.images} />
            </div>
            <div style={{height: $(window).height() - $(window).width(),
              position: "relative"}}>
              <div style={{top: "50%", marginTop: "-70px", position:"absolute", width:"100%"}}>
              <CaptionView data={image} />
              </div>
            <CommentsView comments={image.comments} />
            </div>
          </div>
        );
      });
      return (
        <div>
        {images}
        </div>
      );
    },
  });

  var ImageView = React.createClass({
    render: function() {
      return (
        <img className='main' id="main"
          src={this.props.images.standard_resolution.url} />
      );
    },
    componentDidMount: function(){

      var $main = $('.main_image'),
          $img = $(this.getDOMNode()),
          w = $main.width(),
          h = $main.height(),
          offset = Math.round((h-w)/2);

      $img.css('top', offset + 'px');
    }
  });

  var CaptionView = React.createClass({
    render: function(){
      var data = this.props.data,
          count = data.comments ? data.comments.count : 0,
          user = data.user,
          caption = data.caption,
          caption_view,
          class_name,
          created;

      if(caption === null){
        created = (""+new Date(data.created_time*1000))
          .split(' ').slice(0,5).join(' ');
        caption_view = (
          <p id='caption'>Posted on {created}</p>
        );
      } else {
        class_name = (caption.text.length < 25) ? 'short' : '';
        caption_view = (
          <p id='caption' className={class_name}>{caption.text}</p>
        );
      }
      return (
        <div className="comment">
          <img className="profile_picture" src={user.profile_picture} />
          {caption_view}
          <CommentsCount count={count} />
        </div>
      );
    }
  });
  var CommentsCount = React.createClass({
    render: function(){
      var count = this.props.count;

      if(count === 0){
        return (
          <div></div>
        );
      }
      return (
        <div className="comments_count">{count}</div>
      );
    }
  });
  var CommentsView = React.createClass({
    render: function(){
      var comments = this.props.comments,
          show_last = comments.show_comments;

      if(comments.count > 0 && show_last){
        var comments_list = $.map(comments.data, function(comment){
          var data = {
            user: comment.from,
            caption: comment
          };
          return (
            <CaptionView data={data} />
          );
        });
        return (
          <div className="comments_list">
            {comments_list}
          </div>
        );
      }
      return (
        <div></div>
      );
    }
  });

  var Comment = React.createClass({
    render: function(){
      var comment = this.props.comment;
      return (
        <div></div>
      );
    }
  });

  // Main View
  React.renderComponent(
    <ImageBox url="/check" refreshRate="1000000" />,
    document.getElementById('content')
  );

});
