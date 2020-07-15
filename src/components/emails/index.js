import React from 'react';
import {connect} from 'react-redux';
import p from 'prop-types';
import {withTranslation} from 'react-i18next';
import IrmaButton from '../../helpers/irma_button';

function mapStateToProps(state) {
  return {
    emails: state.userdata.emails,
  };
}

class Emails extends React.Component {
  t = this.props.t;

  deleteEmail(address) {
    return () => this.props.dispatch({
      type: 'removeEmail',
      email: address,
    });
  }

  renderEmailHeader() {
    return (
      <thead>
      <tr>
        <th>{this.t('emailaddress')}</th>
      </tr>
      </thead>
    );
  }

  renderEmailRow (address) {
    return (
      <tr key={address.email}>
        <td>{address.email}</td>
        <td>{
          address.delete_in_progress
            ? this.t('delete_in_progress')
            : <IrmaButton theme={'secondary'} onClick={this.deleteEmail(address.email)}>{this.t('delete')}</IrmaButton>
        }</td>
      </tr>
    );
  }

  render = () => {
    return (
      <div>
        <table>
          {this.renderEmailHeader()}
          <tbody>
          {this.props.emails.map(this.renderEmailRow)}
          </tbody>
        </table>
      </div>
    );
  }
}

Emails.propTypes = {
  t: p.func.isRequired,
  dispatch: p.func.isRequired,
  emails: p.arrayOf(p.object.isRequired).isRequired,
};

export default withTranslation(['emails', 'common'])(connect(mapStateToProps)(Emails));