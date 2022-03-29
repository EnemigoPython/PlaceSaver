# Pagesaver
A Chrome extension to save a place on a webpage.

## Process
> Research selected text API in JS
> Create span with ID to wrap selected text
> Save to local storage with object
```javascript
{
    URL: 
    [
        {
            tagName: spanID
        }
    ]
}
```
> On page load check URL object and add spans
> On page tag request href request to #tag

## Example Repos
> https://github.com/triton11/ChessTier
> https://github.com/jeromepl/highlighter
> https://developer.chrome.com/docs/extensions/mv3/overview/