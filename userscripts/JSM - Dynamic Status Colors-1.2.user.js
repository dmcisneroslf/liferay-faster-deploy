// ==UserScript==
// @name         JSM - Dynamic Status Colors
// @namespace    https://yourcompany.atlassian.net
// @version      1.2
// @description  Dynamically changes the background color of Jira issue statuses based on their text (case-insensitive, supports data-testid selectors)
// @match        https://*.atlassian.net/*
// @author       Daniel Martínez Cisneros
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  // Map of colors by normalized status (all lowercase, spaces removed)
  const statusColors = {
    'pending': '#8fb8f6',
    'awaitinghelp': '#d8a0f7',
    'withproductteam': '#d8a0f7',
    'withsre': '#d8a0f7',
    'inprogress': '#fd9891',
    'solutionproposed': '#FFEB3B',
    'solutionaccepted': '#FFEB3B',
    'closed': '#dddee1',
    'inactive': '#FFEB3B',
    'new': '#FFEB3B'
  };

  // Normalize any status text (remove spaces, punctuation, lowercase)
  function normalizeStatus(text) {
    return text
      .replace(/\s+/g, '')        // remove spaces
      .replace(/[^a-zA-Z]/g, '')  // remove special chars if any
      .toLowerCase();
  }

  // Apply colors dynamically
  function applyColors() {
    // Select both types of elements: dynamic class + data-testid containing "status"
    const elements = document.querySelectorAll('._bfhk1ymo, [data-testid*="issue.fields.status.common.ui.status-lozenge.3"]');

    elements.forEach(el => {
      const rawText = (el.innerText || el.textContent || '').trim();
      const key = normalizeStatus(rawText);
      const color = statusColors[key];
      if (color) {
        el.style.backgroundColor = color;
        el.style.color = '#000'; // dark text for contrast
        el.style.border = 'none';
        el.style.padding = '2px 6px';
        el.style.borderRadius = '4px';
        el.style.transition = 'background-color 0.3s ease';
      }
        // ✅ Make child <span> backgrounds transparent
        el.querySelectorAll('span').forEach(span => {
            span.style.background = 'transparent';
        });
    });
  }

  // Observe DOM changes (Jira updates via React dynamically)
  const observer = new MutationObserver(applyColors);
  observer.observe(document.body, { childList: true, subtree: true });

  // Run once on load
  window.addEventListener('load', applyColors);
})();
