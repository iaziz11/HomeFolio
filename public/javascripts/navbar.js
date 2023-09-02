jQuery(function () {
    let pathArray = (window.location.pathname).split('/');
    let currentPath = pathArray[pathArray.length - 1];
    let navLinks = $('.nav-link');
    navLinks.each(function () {
        if ($(this).text() === 'All Items' && currentPath === 'items') {
            $(this).addClass('active')
        } else if ($(this).text() === 'All Expenses' && currentPath === 'allexpenses') {
            $(this).addClass('active')
        } else if (($(this).text()).toLocaleLowerCase() === currentPath) {
            $(this).addClass('active')
        }
    })

    $('.navbar-logo').on('mouseover', function () {
        $('.navbar-logo').attr('src', '/images/logo-2.png')
    })
    $('.navbar-logo').on('mouseleave', function () {
        $('.navbar-logo').attr('src', '/images/logo.png')
    })

})