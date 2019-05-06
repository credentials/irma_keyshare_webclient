import { Component } from 'preact';

import homeJquery from './home-jquery';

const t = () => 'translation';

export class Home extends Component {
	componentDidMount() {
		window.irma_keyshare_webclient = {
			keyshare_server_url: '',
			api_server_url: '',
			language: 'nl',
			new_api_server: true,
		};

		homeJquery();
	}

	render() {
		return (
			<div>
				<div class="container" id="alert_box">
				</div>

				<div class="container" id="login-container" hidden>
					<div class="col-xs-12 col-md-8 col-lg-6 col-md-offset-2 col-lg-offset-3">
						<h2 id="login-header">{ t('login_header') }</h2>
						<p>{ t('login_par1') }</p>
						<p>{ t('login_par2') }</p>
						<p>{ t('login_list') }</p>

						<ul>
							<li>{ t('login_list_1') }</li>
							<li>{ t('login_list_2') }</li>
						</ul>

						<div class="form-signin">
							<h3 class="form-signin-heading">{ t('login_using ') }</h3>
							<form id="login-form-irma">
								<button class="btn btn-lg btn-primary btn-block" type="submit" id="signin-button-irma">IRMA</button>
							</form>
							<div id="login-separator">{ t('or') }</div>
							<form id="login-form-email">
								<div class="input-group">
									<input type="email" id="input-email" class="form-control" placeholder={ t('login_email_address') } required autofocus />
									<span class="input-group-btn">
										<button class="btn btn-lg btn-primary" type="submit" id="signin-button-email">{ t('login_email_link') }</button>
									</span>
								</div>
							</form>
						</div>
					</div>
				</div>

				<div class="container" id="login-done" hidden>
					<div class="col-xs-12 col-md-8 col-lg-6 col-md-offset-2 col-lg-offset-3">
						<h2>{ t('login_check_email') }</h2>
						<p>{ t('login_check_email_text') }</p>
					</div>
				</div>

				<div class="container" id="enrollment-email-issue" hidden>
					<div class="col-xs-12 col-md-8 col-lg-6 col-md-offset-2 col-lg-offset-3">
						<h2>{ t('enrollment_email_title') }</h2>

						<p>{ t('enrollment_email_par1') }</p>
						<p>{ t('enrollment_email_par2') }</p>

						<button class="btn btn-primary" id="issue-email-btn">{ t('enrollment_email_button') }</button>
					</div>
				</div>

				<div class="container" id="enrollment-finished" hidden>
					<div class="col-xs-12 col-md-8 col-lg-6 col-md-offset-2 col-lg-offset-3">
						<h2>{ t('enrollment_done') }</h2>
						<p>
							{ t('enrollment_done_text') }
							<ul>
								<li>{ t('enrollment_done_list1') }</li>
								<li><a id="show-main" href="#">{ t('enrollment_done_list2') }</a></li>
							</ul>
						</p>
					</div>
				</div>

				<div class="container" id="user-candidates-container" hidden>
					<div class="col-xs-12 col-md-10 col-lg-8 col-md-offset-2 col-lg-offset-2">
						<h3>{ t('candidates_title') }</h3>
						<p>
							{ t('candidates_explanation') }
						</p>
						<ul>
							<li><strong>{ t('candidates_username %>:</strong> <%= candidates_item_1') }</strong></li>
							<li><strong>{ t('candidates_lastseen %>:</strong> <%= candidates_item_2') }</strong></li>
						</ul>
						<table class="table" id="user-candidates">
							<thead>
								<tr>
									<th>{ t('candidates_username') }</th>
									<th>{ t('candidates_lastseen') }</th>
									<th>{ t('login') }</th>
								</tr>
							</thead>
							<tbody id="user-candidates-body">
							</tbody>
						</table>
					</div>
				</div>

				<div class="container" id="user-container" hidden>
					<div class="col-xs-12 col-md-10 col-lg-8 col-md-offset-2 col-lg-offset-2">
						<div class="clearfix" id="main-header-container">
							<h2 id="main-header">{ t('myirma') }</h2>
							<button class="btn btn-primary pull-right" id="logout-btn">{ t('main_logout') }</button>
						</div>
						<p>{ t('main_logged_in_as') }<span id="username"></span></p>

						<div id="issue-email-later" hidden>
							<h3>{ t('main_issue_email') }</h3>
							<p>{ t('main_issue_email_text ') }</p>
							<button class="btn btn-primary issue-email-btn" id="issue-email-later-btn">{ t('main_issue_email_button ') }</button>
						</div>

						<h3>{ t('main_log ') }</h3>
						<button class="btn" id="refresh-btn">{ t('main_log_refresh ') }</button>
						<button class="btn" id="prev-btn"><span class="glyphicon glyphicon-chevron-left"></span> { t('main_log_previous ') }</button>
						<button class="btn" id="next-btn">{ t('main_log_next ') } <span class="glyphicon glyphicon-chevron-right"></span></button>
						<table class="table" id="user-logs">
							<thead>
								<tr>
									<th>{ t('main_when ') }</th>
									<th>{ t('main_event ') }</th>
								</tr>
							</thead>
							<tbody id="user-logs-body">
							</tbody>
						</table>

						<h3>{ t('main_issuance ') }</h3>
						{ t('main_issuance_text ') }

						<div id="known-email-addresses">
							<h3>{ t('main_emailaddresses_title') }</h3>
							<p id="known-email-addresses-text">{ t('main_emailaddresses_text') }</p>
							<p id="no-known-email-addresses-text">{ t('main_emailaddresses_none_text') }</p>
							<table class="table" id="email-addresses-table">
								<thead>
									<tr><th>{ t('email_address') }</th></tr>
								</thead>
								<tbody id="email-addresses-body">
								</tbody>
							</table>
							<button class="btn btn-primary issue-email-btn" id="add-email-btn">{ t('main_emailaddresses_add') }</button>
						</div>

						<h3>{ t('main_delete_title ') }</h3>
						<p>{ t('main_delete_par1 ') }</p>
						<p>{ t('main_delete_par2 ') }</p>
						<button class="btn btn-danger" id="delete-btn" hidden>{ t('main_delete ') }</button>
					</div>
				</div>
			</div>
		)
	}
}

export default Home;
