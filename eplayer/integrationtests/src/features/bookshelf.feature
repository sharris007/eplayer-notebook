Feature:
    In order to keep my product stable
    As a developer or product manager
    I want to make sure that everything works as expected on Bookshelf

Scenario: Bookshelf should be visible after successful login
    Then I expect that element "#bookshelf" becomes visible

Scenario Outline: Bookshelf UI element availability (Pearson Branding Image, Welcome message, Fname & Lname, My bookshelf, Sign out btn)
    Then I expect that element "<link1>" becomes visible
      Examples:
        | link1 |
        | .logo |
        | span*=Welcome |
        | span*=et1_react_qaauto qa_automation_edu2 |
        | .title*=My Bookshelf |
        | .signoutBtn>div>button |

Scenario: Verify the URL of Bookshelf page launches over Https
        Then I expect the url to contain "https://"


Scenario: Verify the Title bar text of Bookshelf page is "Bookshelf"
        Then I expect that the title is "Bookshelf"


Scenario: Verify the presence of book thumbnail
    Given the element ".bookshelf-body" is visible
    Then I expect that element ".bookContainer" does exist
    And I expect that element ".bookContainer" is not empty


Scenario: Verify URL and Title specific properties
  Then I expect that the attribute "src" from element "#bookshelf > div.bookshelf-body > div:nth-child(1) > a.bookContainer > img" is "https://view.cert3.ebookplus.pearsoncmg.com/ebookassets/ebookCM65125662/assets/apple_MLBio10Mnst_SE_thumbnail.jpg"
   And I expect that element "#bookshelf > div.bookshelf-body > div:nth-child(1) > a.bookContainer > p" matches the text "Audio_492_Simp_Automation"

Scenario: Verify the presence of 'i' icon beside the title name
    Given the element "#bookshelf > div.bookshelf-body > div:nth-child(1) > a.bookContainer" is not empty
    Then I expect that element "#bookshelf > div.bookshelf-body > div:nth-child(1) > a.info" is visible


Scenario: Should open the 'more info' pop-up
     When I click on the element "#bookshelf > div.bookshelf-body > div:nth-child(1) > a.info"
     Then I expect that element ".modal" becomes visible


Scenario: Verify presence of title thumbnail, metadata information inside 'more info' pop up
    Then I expect that element ".image-container " becomes visible
    And I expect that element "body*=Audio_492_Simp_Automation" becomes visible
    And I expect that element ".cancelBtn" becomes visible
    And I expect that element "p.footer*=Garg" becomes visible


Scenario: Should close the already open 'more info' pop-up
   When I click on the button ".cancelBtn"
    And I pause for 1000ms
    Then I expect that element ".bookshelf-body" becomes visible


Scenario: should refresh the bookshelf
    When I refresh the browser window
    Then I expect that element ".bookshelf-body" becomes visible

Scenario: Display of Cover Page on Title Launch
    When I click on the element ".bookContainer"
    And I pause for 20000ms
    Then I expect that element ".prevContent" becomes not visible
    Then I click on the element ".back_rec"
    And I pause for 10000ms

Scenario: Display of Loader on Title Launch
    When I click on the element ".bookContainer"
    Then I expect that element ".centerCircularBar" becomes visible
    And I pause for 20000ms
    Then I click on the element ".back_rec"
    And I pause for 10000ms

Scenario: Title loading within 2-3 seconds
    When I click on the element ".bookContainer"
    Then I wait on element ".nextContent" for 20000ms to be enabled
    Then I click on the element ".back_rec"
    And I pause for 10000ms

Scenario: should be able to logout from Bookshelf
    When I click on the element ".signoutBtn>div>button"
    Then I expect that element "#username" becomes visible

Scenario: Scroll Up & Down using Mouse scroll on bookshelf (Also includes Page Scroll)
    When I set "amit_qa_edu2" to the inputfield "#username"
    And I set "Pa55word" to the inputfield "#password"
    And I scroll to element "#mainButton"
    And I click on the button "#mainButton"
    And I pause for 3000ms
    Then I expect that element "#bookshelf" becomes visible
    When I move to element ".bookshelf-body" with an offset of 1207,893
    Then I expect that element "#bookshelf > div.bookshelf-body > div:nth-child(1) > a.bookContainer > p" becomes visible
    When I move to element ".bookshelf-body" with an offset of 0,0
    Then I expect that element ".logo" becomes visible
    And I click on the element ".signoutBtn>div>button"
