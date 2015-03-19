"use strict";

var TeamList = React.createClass({

  getInitialState: function() {
    return { teamList: {} };
  },

  componentDidMount: function() {
    $.get(this.props.source, function(result) {
      if (this.isMounted()) {
        this.setState({
          teamList: JSON.parse(result)
        });
      }
    }.bind(this));
  },


  render: function() {
    if ($.isEmptyObject(this.state.teamList)) {
      return false;
    }

    var teamNodes = this.state.teamList.teams.map(function (team) {
      return (
        <Team data={team.teamName} />
      );
    });
    return (
      <div className="col-sm-6 bootcards-list col-centered">
        <div className="panel panel-default">
          <div className="list-group">
            {teamNodes}
          </div>
        </div>
      </div>
    );
  }
});

var Team = React.createClass({
  handleClick: function(event) {
    currentAppData.team = this.props.data;
    run();
  },
  render: function() {
    return (
      <a className="list-group-item" href="#" onClick={this.handleClick}>
        <h4 className="list-group-item-heading">{this.props.data}</h4>
      </a>
    );
  }
});

var NewTeamForm = React.createClass({
  render: function() {
    return (
      <form className="commentForm">
        <input type="text" placeholder="Your name" />
        <input type="text" placeholder="Say something..." />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

var FeatureCard = React.createClass({
  render: function() {
    return (
      <div className="col-sm-4">
        <div className="panel panel-default bootcards-summary">
          <div className="panel-heading">
            <h3 className="panel-title">usePapiBlogs</h3>
          </div>
          <div className="panel-body">
            <EnvList />
          </div>
          <div className="panel-footer">
            <span className="enableAttr"><i className="fa fa-check-circle"></i> FrontEndEnabled</span>
          </div>
        </div>
      </div>
    );
  }
});

var EnvList = React.createClass({
  render: function() {
    return (
      <div className="row">
        <EnvironmentFlag env="sbx"/>
        <EnvironmentFlag env="dev"/>
        <EnvironmentFlag env="stg"/>
        <EnvironmentFlag env="prd"/>
      </div>
    );
  }
});

var EnvironmentFlag = React.createClass({
  render: function() {
    return (
      <div className="col-xs-6 col-sm-4">
        <a className="bootcards-summary-item" href="#">
          <i className="fa fa-3x fa-star"></i>
          <h4>{this.props.env}<span className="label label-danger">!</span></h4>
        </a>
      </div>
    );
  }
});


var MainScreen = React.createClass({

  getInitialState: function() {
    return { teamData: {} };
  },

  componentDidMount: function() {
    $.get(this.props.source, function(result) {
      var jsonData;
      if (this.isMounted()) {
        console.log(result);
        jsonData = JSON.parse(result);
        this.setState({
          teamData: jsonData
        });
        if (!currentData.token) {
          currentData.token = jsonData.tokens[0];
        }
      }
    }.bind(this));
  },


  render: function() {
    if ($.isEmptyObject(this.state.teamData)) {
      return false;
    }

    console.log(this.state.teamData);

    // var teamTokens = this.state.teamData.tokens.map(function (team) {
    //   return (
    //     <Token data={team} />
    //   );
    // });
    return (
      <div className="row">
      <div className="dropdown col-sm-12">
        Token: <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-expanded="true">
          Dropdown
          <span className="caret"></span>
        </button>
        <ul className="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
          <li role="presentation"><a role="menuitem" tabindex="-1" href="#">Action</a></li>
          <li role="presentation"><a role="menuitem" tabindex="-1" href="#">Another action</a></li>
          <li role="presentation"><a role="menuitem" tabindex="-1" href="#">Something else here</a></li>
          <li role="presentation"><a role="menuitem" tabindex="-1" href="#">Separated link</a></li>
        </ul>
      </div>
      </div>
    );
  }
});


//"{\"name\":\"Test\",\"users\":null,\"tokens\":[{\"team\":\"Test\",\"crc32\":1949307765,\"token\":\"3b374f7cea1e21b8fa4edb8950e0c7f6de078282fd85314f3a4d4294a62c92fe\",\"apps\":{\"doughnuts\":{\"features\":{\"chocolate\":{\"attributes\":{\"displayFE\":1},\"sbx\":1,\"dev\":1,\"stg\":0,\"int\":0,\"prd\":0}}}}}]}"

var HeadMainScreen = React.createClass({
  render: function() {
    var app, sourceUrl;
    if (!this.props.data.team) {
      app = <TeamList source="/svc/clip/teams" />;
    }

    else {
      sourceUrl = "/svc/clip/team/" + this.props.data.team
      //source = "/svc/clip/team/" + this.props.data.team
      app = <MainScreen source={sourceUrl} />;
    }

    return(
      <div>
        {app}
      </div>
    );
  }
});


//var teamData = {"teams":[{"teamName":"IOS"},{"teamName":"MobileWeb"},{"teamName":"Data Universe"},{"teamName":"WebTech"},{"teamName":"Search"}]};

var currentAppData = {
};

var run = function() {
  console.log(currentAppData);
  // Main APP
  React.render(<HeadMainScreen data={currentAppData} />, document.getElementById('content'));
}

run();
