/** @jsx React.DOM */
$(function(){
  var ImageView = React.createClass({
    render: function() {
      return (
        <img className='main' id="main" 
          src={this.props.images.standard_resolution.url} />
      );
    }
  });
  var CommentView = React.createClass({
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
        <div className="comment" id="comment">
          <img id="profile_picture" src={user.profile_picture} />
          {caption_view}
        </div>
      );
    }
  });

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
    render: function(){
      if($.isEmptyObject(this.state)){
        return (
          <div className="loading">
            Loading
          </div>
        );
      }
      return (
        <div>
          <div className="main_image">
            <ImageView images={this.state.images} />
          </div>
          <CommentView data={this.state} />
        </div>
      );
    }
  });

  // Main View
  React.renderComponent(
    <ImageBox url="/check" refreshRate="1000" />,
    document.getElementById('content')
  );
});
