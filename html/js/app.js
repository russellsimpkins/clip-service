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


var TokenList = React.createClass({

  getInitialState: function() {
    return { teamData: {} };
  },

  componentDidMount: function() {
    $.get(this.props.source, function(result) {
      var jsonData;
      if (this.isMounted()) {
        jsonData = JSON.parse(result);
        this.setState({
          teamData: jsonData
        });
      }
    }.bind(this));
  },

  render: function() {
    if ($.isEmptyObject(this.state.teamData)) {
      return false;
    }

    var tokenNodes = this.state.teamData.tokens.map(function (token) {
      return (
        <Token data={token} />
      );
    });

    return (
      <div className="col-sm-6 bootcards-list col-centered">
        <div className="panel panel-default">
          <div className="list-group">
            {tokenNodes}
          </div>
        </div>
      </div>
    );
  }
});

var Token = React.createClass({
  handleClick: function(event) {
    currentAppData.token = this.props.data;
    currentAppData.apps  = this.props.data.apps;
    run();
  },
  render: function() {
    return (
      <a className="list-group-item" href="#" onClick={this.handleClick}>
        <h4 className="list-group-item-heading">{this.props.data.name}</h4>
      </a>
    );
  }
});


var ApplicationGroups = React.createClass({

  getInitialState: function() {
    return { apps: currentAppData.apps };
  },

  componentDidMount: function() {
    if (!this.state.apps) {
      //TODO
      // $.get(this.props.source, function(result) {
      //   if (this.isMounted()) {
      //     this.setState({
      //       apps: JSON.parse(result)
      //     });
      //   }
      // }.bind(this));
    }
  },

  render: function() {
    if ($.isEmptyObject(this.state.apps)) {
      return false;
    }

    var appNames = Object.keys(this.state.apps);
    var appData = this.state.apps;
    var appList = appNames.map(function (appName) {
      return (
        <div className="col-sm-12">
          <h3 className="row">Application: {appName}</h3>
          <div className="row">
            <FeatureCardGroup data={appData[appName].features} />
          </div>
        </div>
      );
    });
    return (
      <div>{appList}</div>
    );
  }
});

var FeatureCardGroup = React.createClass({

  render: function() {

    var featureNames = Object.keys(this.props.data);
    var featureData = this.props.data;
    var featureList = featureNames.map(function (feature) {
      return (
        <FeatureCard data={featureData[feature]} featureName={feature} />
      )
    });
    return (
      <div>{featureList}</div>
    );
  }
});



var FeatureCard = React.createClass({

  render: function() {
    return (
      <div className="col-sm-4">
        <div className="panel panel-default bootcards-summary">
          <div className="panel-heading">
            <h3 className="panel-title">{this.props.featureName}</h3>
          </div>
          <div className="panel-body">
            <div className="row">
              <EnvironmentFlag env="sbx" data={this.props.data.sbx}/>
              <EnvironmentFlag env="dev" data={this.props.data.dev}/>
              <EnvironmentFlag env="stg" data={this.props.data.stg}/>
              <EnvironmentFlag env="int" data={this.props.data.int}/>
              <EnvironmentFlag env="prd" data={this.props.data.prd}/>
            </div>
          </div>
          <div className="panel-footer">
            <span className="enableAttr"><i className="fa fa-check-circle"></i> FrontEndEnabled</span>
          </div>
        </div>
      </div>
    );
  }
});


var EnvironmentFlag = React.createClass({
  getInitialState: function() {
    return ({
      active: (this.props.data === 1),
      change: false
    })
  },
  handleClick: function() {
    console.log(this.props);
    this.setState({
      active: !this.state.active,
      change: !this.state.change
    });
  },
  render: function() {
    var classes = "bootcards-summary-item";
    if (this.state.active) {
      classes += " active";
    }
    return (
      <div className="col-xs-6 col-sm-4">
        <a className={classes} onClick={this.handleClick}>
          <i className="fa fa-3x fa-star"></i>
          <h4>{this.props.env}{this.state.change ? <span className="label label-danger">!</span> : ''}</h4>
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
        if (!currentAppData.token) {
          currentAppData.token = jsonData.tokens[0];
        }
      }
    }.bind(this));
  },


  render: function() {
    if ($.isEmptyObject(this.state.teamData)) {
      return false;
    }

    var tokenNodes = this.state.teamData.tokens.map(function (token) {
      return (
        <Token data={token} />
      );
    });

    // var teamTokens = this.state.teamData.tokens.map(function (team) {
    //   return (
    //     <Token data={team} />
    //   );
    // });
    return (
      <div className="row">
      <div className="dropdown col-sm-12">
        <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-expanded="true">
          Choose Token
          <span className="caret"></span>
        </button>
        <ul className="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
          {tokenNodes}
        </ul>
      </div>
      </div>
    );
  }
});


//"{\"name\":\"Test\",\"users\":null,\"tokens\":[{\"team\":\"Test\",\"crc32\":1949307765,\"token\":\"3b374f7cea1e21b8fa4edb8950e0c7f6de078282fd85314f3a4d4294a62c92fe\",\"apps\":{\"doughnuts\":{\"features\":{\"chocolate\":{\"attributes\":{\"displayFE\":1},\"sbx\":1,\"dev\":1,\"stg\":0,\"int\":0,\"prd\":0}}}}}]}"

var HeadMainScreen = React.createClass({

  selectApp: function() {
    var sourceUrl;

    if (!this.props.data.team) {
      return <TeamList source="/svc/clip/teams" />;
    }

    sourceUrl = "/svc/clip/team/" + this.props.data.team
    if (!this.props.data.token) {
      return <TokenList source={sourceUrl} />;
    }

    return <ApplicationGroups source={sourceUrl} />;
  },
  render: function() {
    var app = this.selectApp();

    return(
      <div>
        {app}
      </div>
    );
  }
});


//var teamData = {"teams":[{"teamName":"IOS"},{"teamName":"MobileWeb"},{"teamName":"Data Universe"},{"teamName":"WebTech"},{"teamName":"Search"}]};

var currentAppData = {};

var run = function() {
  console.log(currentAppData);
  // Main APP
  React.render(<HeadMainScreen data={currentAppData} />, document.getElementById('content'));
}

run();
