Feature:
    In order to keep my product stable
    As a developer or product manager
    I want to make sure that everything works as expected

        
Scenario Outline: Presence of labels (Sign in, Username, Password, copyright message) in Login page
    Given I open the site "/eplayer"
    Then I expect that element ".auth-form.ng-scope" becomes visible
    And I pause for 1000ms
    Then I expect that element "<label1>" contains the text "<text1>"
        Examples:
        | label1 | text1 |
        | .pe-page-title.pe-page-title--small.ng-binding |  Sign in |
        | #mainForm > div:nth-child(4) > label |  Username |    
        | #mainForm > div:nth-child(5) > label |  Password |
        | .copyright | Copyright © 2017 Pearson Education Inc. All rights reserved. |

Scenario Outline: Presence of Buttons (Show, sign In, Help in Sidebar) in Login page
    Then I expect that element "<btn1>" becomes visible
        Examples:
        | btn1 |
        | .toggle-pw-button |
        | #mainButton |
        | #help-in-form |


Scenario Outline: Presence of links (Forgot Username/ Password, Footer links) in Login page
    Then I expect that element "<link1>" becomes visible
        Examples:
        | link1 |
        | #forgotUsernameOrPasswordLink |
        | #supportLink |
        | span*=Accessibility |
        | span*=Privacy |    
        | span*=Terms |

Scenario: Should be able to access Help link from Footer
    When I scroll to element "#supportLink"
    And I click on the element "#supportLink"
    Then I expect that element "#o-contextual-help-drawer" becomes visible
   And I pause for 1000ms
    Then I click on the element ".pe-icon--btn.close-help"

Scenario Outline: Should be able to access footer links
    When I click on the element "<LinkName>"
    And I focus the last opened tab
    Then I expect that element "<NewPage>" becomes visible
    And I pause for 1000ms
    Then I close the last opened tab
 Examples:
 | LinkName | NewPage |
 | span*=Accessibility | .mar-bot--125 |
 | span*=Privacy | h1*=Privacy |
 | span*=Terms | h1*=Pearson |



Scenario Outline: Failed Login for incorrect username or password
    When I set "<username1>" to the inputfield "#username"
    And I set "<password1>" to the inputfield "#password"
    And I click on the button "#mainButton"
    Then I expect that element ".panel-title.pe-form--error.ng-binding" becomes visible

    Examples:
    | username1 | password1 |
    | et1_qaautomation_edu1 |  Pa55word111 |
    | xxxxxx |  Pa55word@123 |


Scenario: should display error when username or password field left blank
    When I set " " to the inputfield "#username"
    And  I set " " to the inputfield "#password"
    Then I expect that element "#mainForm > div:nth-child(4) > div > div > div" becomes visible
    And I expect that element "#mainForm > div:nth-child(5) > div.pe-error-wrapper > div > div" becomes visible 


Scenario: should let you log in with correct Username and correct Password
    When I set "et1_qaautomation_edu1" to the inputfield "#username"
    Then I expect that element "#username" contains the text "et1_qaautomation_edu1"
    When I set "Pa55word@123" to the inputfield "#password"
    And I click on the button "#mainButton"
    Then I expect that element "#bookshelf" becomes visible 