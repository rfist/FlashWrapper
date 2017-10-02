/**
 * Created by rfist on 02.10.2017.
 */
var React = require('react');
var ReactDOM = require('react-dom');
var List = require('../swf/version-list');
console.log("list", List.versions);
var student_id = "sftest", secondClient = false, record = true, tempVar = "n=" + student_id + "&r=false", serverURL = '', swfURL = "swf/student.swf?" + Math.floor(Math.random() * 10000);
var TestInput = React.createClass({
    componentDidMount: function() { //ставим фокус в input
        ReactDOM.findDOMNode(this.refs.myTestInput).focus();
    },
    onButtonHandler: function () {
        var id = ReactDOM.findDOMNode(this.refs.myTestInput).value;
        this.props.updateValue(id);
    },
    onChangeHandler: function (event) {
    },
    render: function() {
        return (
            <div>
                <input
                    className='test-input'
                    onChange={this.onChangeHandler}
                    placeholder="student's id"
                    ref='myTestInput'
                    defaultValue = {student_id}
                />
                <button onClick={this.onButtonHandler}>Change</button>
            </div>
        );
    }
});

var FlashClient = React.createClass({
    render: function() {
        var params = this.props.params;
        return (
            <div>
                <object id="client" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="460" height="385">
                    <object type="application/x-shockwave-flash" data={swfURL} width="460" height="385" param="{}">
                        <param name="flashvars" value={params} />
                        <div>
                            <h1>Alternative content</h1>
                        </div>
                    </object>
                </object>
            </div>
        );
    }
});

var FlashClient2 = React.createClass({
    render: function() {
        var params = this.props.params;
        return (
            <div>
                <object id="client" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="460" height="385">
                    <object type="application/x-shockwave-flash" data={swfURL} width="460" height="385" param="{}">
                        <param name="flashvars" value={params} />
                        <div>
                            <h1>Alternative content</h1>
                        </div>
                    </object>
                </object>
            </div>
        );
    }
});

var ServerSelect = React.createClass({
    getInitialState: function() {
        return {
            value: 'default'
        }
    },
    render: function () {
        return (
            <div>
                <span>Server: </span>
                <select onChange={this.change} value={this.state.value}>
                    <option value="default">Default</option>
                    <option value="test">Dev Test</option>
                </select>
            </div>
        );
    },
    change: function(event){
        console.log('change state', event);
        this.setState({value: event.target.value});
        this.props.updateValue(event.target.value);
    }
});

var VersionSelect = React.createClass({
    getInitialState: function() {
        return {
            value: 'default'
        }
    },
    render: function () {
        var options = "";
        List.versions.forEach(version => options += "<option value='" + version + "'>" + version + "</option>\n");
        return (
            <div>
                <span>Version: </span>
                <select  onChange={this.change} value={this.state.value} dangerouslySetInnerHTML={{__html: options}}>
                </select>
            </div>
        );
    },
    change: function(event){
        console.log('change state', event);
        this.setState({value: event.target.value});
        this.props.updateValue(event.target.value);
    }
});


var App = React.createClass({
    getInitialState: function() {
        return {
            counter: 0
        }
    },
    onUpdateValue: function (id) {
        console.log("get new id", id);
        secondClient = !secondClient;
        tempVar = "n="+ id + "&r=false";
        this.forceUpdate();
    },
    onUpdateServer: function (server) {
        console.log('server has been changed to ', server);
        if (server == 'default') {
            serverURL = '';
        } else {
            serverURL = '&s=' + server;
        }
        secondClient = !secondClient;
        this.forceUpdate();
    },
    onUpdateVersion: function (version) {
        swfURL = "swf/student_" + version + ".swf?" + Math.floor(Math.random() * 10000);
        console.log("swfURL", swfURL);
        secondClient = !secondClient;
        this.forceUpdate();
    },
    render: function() {
        console.log("render", tempVar + serverURL);
        if (secondClient) {
            return (
                <div className='app'>
                    <FlashClient2 params={tempVar + serverURL}/>
                    <TestInput updateValue={this.onUpdateValue}/>
                    <br/>
                    <ServerSelect updateValue={this.onUpdateServer}/>
                    <VersionSelect updateValue={this.onUpdateVersion}/>
                </div>
            );
        } else {
            return (
                <div className='app'>
                    <FlashClient params={tempVar + serverURL}/>
                    <TestInput updateValue={this.onUpdateValue}/>
                    <br/>
                    <ServerSelect updateValue={this.onUpdateServer}/>
                    <VersionSelect updateValue={this.onUpdateVersion}/>
                </div>
            );
        }
    }
});

ReactDOM.render(
    <App />,
    document.getElementById('root')
);

window.getRabbitmqPass = function getRabbitmqPass() {
    // return "FmcfH082P04HLQkhP2c=";
    return "AyEhKFIfRRAHPR46";
};

window.getAmsList = function getAmsList() {
    if (serverURL == "") {
        return [{"id":1, "url":"rtmp://media.proctoru.com/proctor", "live_streams_count":3, "up":true},{"id":2, "url":"rtmp://media.proctoru.com/proctor", "live_streams_count":3, "up":true}];
    } else {
        return [{"id":1, "url":"rtmp://ec2-107-20-35-96.compute-1.amazonaws.com/proctor", "live_streams_count":3, "up":true}];
    }
};