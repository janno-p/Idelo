$(document).ready(function () {
  initializeLogin();

  $.get(templateName, function (data) {
    $('#container').prepend(data);
    Holder.run();
    var emailAddress = getParameter('email');
    if (emailAddress) {
      $('strong.replace-email').text(emailAddress);
    }
  });
});
