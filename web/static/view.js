/** @jsx React.DOM */
$(function(){

  var ImageBox = React.createClass({
    loadCommentsFromServer: function(){
      $.getJSON(this.props.url, function(data){
          this.setState(data);
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
    toggleComments: function(){
      this.setState({
        show_comments: !this.state.show_comments
      });
    },
    render: function(){
      if($.isEmptyObject(this.state)){
        return (
          <div className="loading">
            Loading
          </div>
        );
      }
      return (
        <div onClick={this.toggleComments}>
          <div className="main_image">
            <ImageView images={this.state.images} />
          </div>
          <CaptionView data={this.state} />
          <CommentsView comments={this.state.comments}
            show_comments={this.state.show_comments} />
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
        </div>
      );
    }
  });

  var CommentsView = React.createClass({
    render: function(){
      var comments = this.props.comments,
          show_last = this.props.show_comments;
      if(comments.count === 0){
        return (
          <div></div>
        );
      }
      if(show_last){
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
        <div className="comments_count">{comments.count}</div>
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
