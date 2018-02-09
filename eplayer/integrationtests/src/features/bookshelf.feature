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
        | span*=et1_edu2 qa_automation |
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
  Then I expect that the attribute "src" from element "#bookshelf > div.bookshelf-body > div:nth-child(1) > a.bookContainer > img" is "https://view.cert1.ebookplus.pearsoncmg.com/ebookassets/ebookCM16687367/assets/apple_MLBio10Mnst_SE_thumbnail.jpg"
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
    Then I wait on element ".bookshelf-body" for 120000ms to be visible

Scenario: should refresh the bookshelf
    When I refresh the browser window
    Then I expect that element ".bookshelf-body" becomes visible

Scenario: Display of Cover Page on Title Launch
    When I click on the element ".bookContainer"
    Then I wait on element "#docViewer_ViewContainer_PageContainer_0" for 120000ms to be visible
    And I expect that element ".prevContent" becomes not visible
    When I click on the element ".pe-icon--chevron-back-18"
    Then I wait on element "#bookshelf" for 120000ms to be visible

Scenario: Display of Loader on Title Launch
    When I click on the element ".bookContainer"
    Then I expect that element ".centerCircularBar" becomes visible
    And I wait on element ".pe-icon--chevron-back-18" for 120000ms to be visible
    When I click on the element ".pe-icon--chevron-back-18"
    Then I wait on element "#bookshelf" for 120000ms to be visible

Scenario: Title loading within 2-3 seconds
    When I click on the element ".bookContainer"
    Then I wait on element ".nextContent" for 20000ms to be enabled
    When I click on the element ".pe-icon--chevron-back-18"
    Then I wait on element "#bookshelf" for 120000ms to be visible

Scenario: should be able to logout from Bookshelf
    When I click on the element ".signoutBtn>div>button"
    Then I expect that element "#username" becomes visible

Scenario: Scroll Up & Down using Mouse scroll on bookshelf (Also includes Page Scroll)
    When I set "amit_qa_edu2" value in element "#username" and "Pa55word" value in element "#password" and click on "#mainButton" button
    Then I wait on element "#bookshelf" for 120000ms to be visible
    When I move to element ".bookshelf-body" with an offset of 1207,893
    Then I expect that element "#bookshelf > div.bookshelf-body > div:nth-child(1) > a.bookContainer > p" becomes visible
    When I move to element ".bookshelf-body" with an offset of 0,0
    Then I expect that element ".logo" becomes visible
    When I click on the element ".signoutBtn>div>button"
    Then I wait on element "#username" for 3000ms to be visible
