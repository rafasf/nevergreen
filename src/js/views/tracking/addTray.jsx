var React = require('react/addons')

module.exports = {

    AddTray: React.createClass({
        mixins: [React.addons.LinkedStateMixin],

        propTypes: {
            addTray: React.PropTypes.func.isRequired
        },

        getInitialState: function () {
            return {
                url: '',
                username: '',
                password: ''
            }
        },

        render: function () {
            return (
                <div className='tracking-cctray-group-cctray-form'>
                    <label htmlFor='cctray-url' className='tracking-cctray-group-cctray-form-label'>url</label>
                    <input ref='urlInput' id='cctray-url' className='tracking-cctray-group-cctray-form-input' type='text' placeholder='e.g. http(s)://host:port/cc.xml' valueLink={this.linkState('url')} onKeyPress={this.onKeyPress}/>
                    <button ref='addButton' id='cctray-fetch' className='button-primary' onClick={this.onClick}>add</button>
                    <div>
                        <div id='authentication-group' className='tracking-cctray-group-authentication'>
                            <label htmlFor='username'>username</label>
                            <input ref='usernameInput' id='username' className='tracking-cctray-group-cctray-form-input-authentication tracking-cctray-group-cctray-form-input' type='text' valueLink={this.linkState('username')} onKeyPress={this.onKeyPress}/>
                            <label htmlFor='password'>password</label>
                            <input ref='passwordInput' id='password' className='tracking-cctray-group-cctray-form-input-authentication tracking-cctray-group-cctray-form-input' type='password' valueLink={this.linkState('password')} onKeyPress={this.onKeyPress}/>
                        </div>
                    </div>
                </div>
            )
        },

        onClick: function () {
            this.props.addTray(this.state)
        },

        onKeyPress: function (evt) {
            if (evt.key === 'Enter') {
                this.props.addTray(this.state)
            }
        }
    })

}