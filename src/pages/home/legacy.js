import moment from 'moment';
import $ from 'jquery';
import Cookies from 'js-cookie';

require('@privacybydesign/irmajs/dist/irma');

export default function({ config: conf, language }) {
  const strings = {};
  const server = conf.keyshare_server_url;

  let user;
  let logStart = 0, logNext = 0, logPrev = 0;

  moment.locale(language);

  // IRMA.init(conf.irma_server_url, {lang: language, newServer: conf.new_api_server});

  // -- UTIL FUNCTIONS --
  function loginSuccess() {
    console.log("Login success");
    $("#login-container").hide();
    $("#login-done").show();
  }

  function loginError(jqXHR, status, error) {
    console.log(jqXHR, status, error);
    showError(strings.keyshare_error_occured);
  }

  function showError(message) {
    $("#alert_box").html("<div class=\"alert alert-danger\" role=\"alert\">"
                 + "<strong>" + message + "</strong></div>");
  }

  const showWarning = function(msg) {
    $("#alert_box").html("<div class=\"alert alert-warning\" role=\"alert\">"
               + "<strong>Warning:</strong> " + msg + "</div>");
  };

  const showSuccess = function(msg) {
    $("#alert_box").html("<div class=\"alert alert-success\" role=\"alert\">"
                + msg + "</div>");
  };

  // -- VARIOUS --
  $("#login-form-irma").on("submit", function() {
    console.log("IRMA signin button pressed");
    $(".form-group").removeClass("has-error");
    $("#alert_box").empty();

    $.ajax({
      type: "GET",
      url: server + "/web/login-irma",
      success: function(request) {
        window.irma.startSession(conf.irma_server_url, request)
        .then((e) => console.log('hai', e))
        .catch((e) => console.log('noes', e))


        // IRMA.verify(data, discloseSuccess, showWarning, showError);
      },
      error: showError,
    });

    return false;
  });

  $("#login-form-email").on("submit", function() {
    console.log("Email signin button pressed");
    $(".form-group").removeClass("has-error");
    $("#alert_box").empty();

    const email = $("#input-email").prop("value");
    const loginObject = { "email": email, "language": language };

    $.ajax({
      type: "POST",
      dataType: "json",
      contentType: "application/json;charset=utf-8",
      url: server + "/web/login",
      data: JSON.stringify(loginObject),
      success: loginSuccess,
      error: loginError,
    });

    return false;
  });

  function discloseSuccess(jwt) {
    $.ajax({
      type: "POST",
      dataType: "json",
      contentType: "text/plain",
      url: server + "/web/login-irma/proof",
      data: jwt,
      success: tryLoginFromCookie,
      error: loginError,
    });
  }

  function getUserObject(userId, onDone) {
    $.ajax({
      type: "GET",
      url: server + "/web/users/" + userId,
      success: onDone,
      error: function() {
        showError(strings.keyshare_session_expired);
        Cookies.remove("sessionid", { path: "/" });
        showLogin();
      },
    });
  }

  $("#disable-btn").on("click", function() {
    BootstrapDialog.show({
      title: strings.keyshare_block_question,
      message: strings.keyshare_block_message,
      type: BootstrapDialog.TYPE_DANGER,
      buttons: [{
        id: "disable-cancel",
        label: strings.keyshare_cancel,
        cssClass: "btn-secondary",
        action: function(dialogRef) {
          dialogRef.close();
        },
      }, {
        id: "disable-confirm",
        label: strings.keyshare_block,
        cssClass: "btn-danger",
        action: function(dialogRef) {
          $.ajax({
            type: "POST",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            url: server + "/web/users/" + user.ID + "/disable",
            success: showUserPortal,
          });
          dialogRef.close();
        },
      }],
    });
  });

  $("#delete-btn").on("click", function() {
    BootstrapDialog.show({
      title: strings.keyshare_delete_question,
      message: strings.keyshare_delete_message,
      type: BootstrapDialog.TYPE_DANGER,
      buttons: [{
        id: "delete-cancel",
        label: strings.keyshare_cancel,
        cssClass: "btn-secondary",
        action: function(dialogRef) {
          dialogRef.close();
        },
      }, {
        id: "delete-confirm",
        label: strings.keyshare_delete,
        cssClass: "btn-danger",
        action: function(dialogRef) {
          $.ajax({
            type: "POST",
            url: server + "/web/users/" + user.ID + "/delete",
            success: function() {
              showLoginContainer(strings.keyshare_deleted);
            },
          });
          dialogRef.close();
        },
      }],
    });
  });

  $("#refresh-btn").on("click", function() {
    logStart = 0; // Ensures we fetch the most recent events
    updateUserContainer();
  });

  function showLoginContainer(message) {
    $("#user-container").hide();
    $("#login-container").show();
    if (typeof message !== "undefined")
      showSuccess(message);
  }

  $("#logout-btn").on("click", function() {
    $.ajax({
      type: "GET",
      url: server + "/web/logout",
      success: function() {
        showLoginContainer(strings.keyshare_loggedout);
      },
    });
  });

  function showEnrolled(data) {
    user = data;
    Cookies.remove("enroll", { path: "/" });
    $("#enrollment-email-issue").show();
    $("span#enrollment-email-address").html(user.username);
  }

  function showUserPortal(data) {
    console.log("Showing user Portal now");
    user = data;

    updateUserContainer();
    $("#user-candidates-container").hide();
    $("#login-container").hide();
    $("#user-container").show();
  }

  function updateUserContainer() {
    $("#username").html(user.username);
    $("#disable-btn").prop("disabled", !user.enabled);
    if (user.emailIssued)
      $("#issue-email-later").hide();
    else
      $("#issue-email-later").show();
    updateEmailAddresses();
    updateUserLogs();
  }

  function updateEmailAddresses() {
    if (user.emailAddresses.length > 0) {
      $("#no-known-email-addresses-text").hide();
      $("#email-addresses-table").show();
      $("#known-email-addresses-text").show();
    } else {
      $("#known-email-addresses-text").hide();
      $("#email-addresses-table").hide();
      $("#no-known-email-addresses-text").show();
    }

    const tableContent = $("#email-addresses-body");
    tableContent.empty();
    for (let i = 0; i < user.emailAddresses.length; i++) {
      const tr = $("<tr>").appendTo(tableContent);
      tr.append($("<td>", { text: user.emailAddresses[i] }));
      tr.append($("<button>", {
        class: "btn btn-primary btn-sm",
        text: strings.keyshare_delete,
        // Ugly voodoo to capture the current email address into the callback
        click: (function (email) { return function() {
          confirmDeleteEmail(email);
        };})(user.emailAddresses[i]),
      }).wrap("<td>").parent());

    }
  }

  function confirmDeleteEmail(email) {
    BootstrapDialog.show({
      title: strings.delete_email_title,
      message: strings.delete_email_message,
      type: BootstrapDialog.TYPE_PRIMARY,
      buttons: [{
        id: "delete-cancel",
        label: strings.keyshare_cancel,
        cssClass: "btn-secondary",
        action: function(dialogRef) {
          dialogRef.close();
        },
      }, {
        id: "delete-confirm",
        label: strings.keyshare_delete,
        cssClass: "btn-primary",
        action: function(dialogRef) {
          $.ajax({
            type: "POST",
            url: server + "/web/users/" + user.ID + "/remove_email/" + email,
            success: showUserPortal,
            // TODO error
          });
          dialogRef.close();
        },
      }],
    });
  }

  $("#add-email-btn").on("click", function() {
    $.ajax({
      type: "GET",
      url: server + "/web/users/" + user.ID + "/add_email",
      success: function(data) {
        IRMA.verify(data, showEmailSuccess, showWarning, showError);
      },
      error: showError,
    });
  });

  function showEmailSuccess(jwt) {
    $.ajax({
      type: "POST",
      dataType: "json",
      contentType: "text/plain",
      url: server + "/web/users/" + user.ID + "/add_email",
      data: jwt,
      success: showUserPortal,
      error: showError,
    });
  }

  // -- LOGS --
  function updateUserLogs() {
    console.log("Querying logs earlier than " + logStart);
    $.ajax({
      type: "GET",
      dataType: "json",
      contentType: "application/json;charset=utf-8",
      url: server + "/web/users/" + user.ID + "/logs/" + logStart,
      success: processUserLogs,
    });
  }

  function processUserLogs(data) {
    // Update state and buttons
    logNext = data.next;
    logPrev = data.previous;
    $("#next-btn").prop("disabled", typeof logNext === "undefined");
    $("#prev-btn").prop("disabled", typeof logPrev === "undefined");
    $("#refresh-btn").prop("disabled", typeof logPrev !== "undefined");

    if (logPrev === "undefined")
      logStart = 0; // Make sure the Refresh button retrieves previously unseen events

    if (data.entries.length === 0)
      return;

    // Repopulate table
    const tableContent = $("#user-logs-body");
    tableContent.empty();
    for (let i = 0; i < data.entries.length; i++) {
      const entry = data.entries[i];
      tableContent.append("<tr><td title=\""
          + moment(entry.time).format("dddd, D MMM YYYY, H:mm:ss")
          + "\">"
          + moment(entry.time).fromNow()
          + "</td><td>"
          + getEventString(entry) + "</td></tr>");
    }
  }

  function getEventString(entry) {
    if (typeof strings === "undefined") {
      // If strings are not yet loaded, fail silently
      return "";
    }
    if (!("keyshare_event_" + entry.event in strings)) {
      showError(strings.keyshare_event_error);
      return "";
    }
    return strings["keyshare_event_" + entry.event].replace("{0}", entry.param);
  }

  $("#prev-btn").on("click", function() {
    if (logPrev === 0)
      return;

    logStart = logPrev;
    updateUserLogs();
  });

  $("#next-btn").on("click", function() {
    if (logNext === 0)
      return;

    logStart = logNext;
    updateUserLogs();
  });

  // -- LOGIN --
  function tryLoginFromCookie() {
    const token = Cookies.get("token");
    if (token !== undefined) {
      // Multiple user candidates were found, and we are not yet logged in
      // Fetch the candidates and render them in a table, allowing the user to choose one
      $.ajax({
        type: "GET",
        dataType: "json",
        url: server + "/web/candidates/" + token,
        success: function(candidates) {
          showUserCandidates(token, candidates);
        },
        error: function() {
          showError(strings.keyshare_session_expired);
          Cookies.remove("token", { path: "/" });
          showLogin();
        },
      });
      return;
    }

    const sessionId = Cookies.get("sessionid");
    const userId = Cookies.get("userid");
    if (sessionId !== undefined) {
      if (Cookies.get("enroll") === "true") {
        getUserObject(userId, showEnrolled);
      } else {
        getUserObject(userId, showUserPortal);
      }
    } else {
      showLogin();
    }
  }

  function cookiesEnabled() {
    return ("cookie" in document && (document.cookie.length > 0
      || (document.cookie = "test").indexOf.call(document.cookie, "test") > -1));
  }

  function showUserCandidates(token, candidates) {
    $("#user-candidates-container").show();
    const tableContent = $("#user-candidates-body");
    let candidate;
    let relTime, absTime = "";
    for (let i = 0; i < candidates.length; i++) {
      candidate = candidates[i];
      if (!Number.isInteger(candidate.lastActive) || candidate.lastActive === 0) {
        relTime = strings.never;
      } else {
        absTime = moment.unix(candidate.lastActive).format("dddd, D MMM YYYY, H:mm:ss");
        relTime = moment.unix(candidate.lastActive).fromNow();
      }
      tableContent.append("<tr><td>" + candidate.username
        + "</td><td title='" + absTime + "'>" + relTime
        + "</td><td id=login-" + i + "></td></tr>");
      $("#login-" + i).append($("<button>", {
        class: "btn btn-primary btn-sm",
        text: strings.login,
        // Ugly voodoo to capture the current value of candidate.username into the callback
        click: (function (token, username) { return function() {
          $.ajax({
            type: "GET",
            url: server + "/web/login/" + token + "/" + username,
            success: tryLoginFromCookie,
            error: function() {
              showError(strings.keyshare_verification_error);
            },
          });
        };})(token, candidate.username),
      }));
    }
  }

  function showLogin() {
    $("#login-container").show();
  }

  // -- EMAIL ISSUING --
  function issueEmail(successCallback) {
    // Clear errors
    $(".form-group").removeClass("has-error");
    $("#alert_box").empty();

    $.ajax({
      type: "GET",
      url: server + "/web/users/" + user.ID + "/issue_email",
      success: function(data) {
        IRMA.issue(data, function() {
          $.ajax({ // Notify server of email issuance success
            type: "POST",
            url: server + "/web/users/" + user.ID + "/email_issued",
            success: function(data) {
              user = data;
            },
          });
          successCallback();
        }, showWarning, showError);
      },
      error: showError,
    });
  }

  $("#issue-email-btn").on("click", function() {
    $("#email-issue-help").show();

    issueEmail(function() {
      $("#enrollment-email-issue").hide();
      $("#enrollment-finished").show();
    });
  });

  $("#issue-email-later-btn").on("click", function() {
    issueEmail(function() {
      $("#issue-email-later").hide();
    });
  });

  $("#show-main").on("click", function() {
    updateUserContainer();
    $("#enrollment-finished").hide();
    $("#user-container").show();
    return false;
  });

  // -- INIT --
  $("a.frontpage").attr("href", window.location.href.replace(window.location.hash, ""));
  if (!cookiesEnabled())
    showError(strings.keyshare_cookies);
  else
    tryLoginFromCookie();
};