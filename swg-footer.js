/* Songs With Grace: shared copyright attribution. Edit this file for future changes. */
(function () {
  'use strict';
  const copyrightYear = '2026';
  const copyrightName = 'Madelyn Dionne Ministry';
  function updateCopyright() {
    document.querySelectorAll('[data-swg-copyright]').forEach(function (paragraph) {
      const name = document.createElement('em');
      name.textContent = copyrightName;
      const license = paragraph.querySelector('a[href="license.html"]');
      paragraph.replaceChildren(document.createTextNode('© ' + copyrightYear + ' '), name);
      if (license) {
        paragraph.append(document.createTextNode('. Free noncommercial use is welcome under the '));
        paragraph.append(license);
        paragraph.append(document.createTextNode('. Other rights reserved.'));
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', updateCopyright);
  else updateCopyright();
}());
