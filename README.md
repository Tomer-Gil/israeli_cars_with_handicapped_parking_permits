# israeli_cars_with_handicapped_parking_tags
An API for Israeli vehicles with handicapped parking permit

# Helpful Documentation
Dataset page on data.gov.il:
https://data.gov.il/dataset/rechev-tag-nachim

Latest resource page (as of 13/6/21):
https://data.gov.il/dataset/rechev-tag-nachim/resource/c8b9f9c8-4612-4068-934f-d4acd2e3c06e

Resource filtered with package_search:
https://data.gov.il/api/3/action/package_search?q=name:rechev-tag-nachim

# Debug Nodejs Input With VSCode
Based on:
https://stackoverflow.com/questions/41100916/node-js-readline-in-debug-console-in-visual-studio-code

It currently seems like there's no option to receive input in the debug console in VSCode.
But a program can be debugged with another console which allows input.
1) Open launch.json.
2) Change the "program" propery in "configurations" to the desired file.
3) Add "console": "integratedTerminal" for the VSCode terminal or "externalTerminal" to pop-up a cmd window.