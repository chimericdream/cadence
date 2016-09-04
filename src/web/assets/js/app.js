$('.bridge-enable-button, .bridge-disable-button').on('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    const $el = $(event.target);
    const $title = $el.parent().parent().find('.card-title');

    $.ajax({
        'url': $el[0].href,
        'method': 'PUT',
        'success': () => {
            $title.find('span').toggle();
            $el.parent().find('.bridge-enable-button, .bridge-disable-button').toggle();
        }
    });
});

$('#account-name').on('blur', () => {
    if ($('#account-slug').val() === '') {
        let safeSlug;
        safeSlug = $('#account-name')
            .val()
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/^(.+)-$/, '$1')
            .replace(/^-(.+)$/, '$1');

        $('#account-slug').val(safeSlug);
    }
});
