Feature:
    In order to keep my product stable
    As a developer or product manager
    I want to make sure that everything works as expected

Scenario: Bookshelf should be visible
    Then I expect that element "#bookshelf" becomes visible

Scenario: Should launch the book
    When I click on the button "p*=Audio_492_Simp_Automation"
    Then I wait on element "#docViewer_ViewContainer_PageContainer_0" for 120000ms to be visible

Scenario: Verify the availability of search icon [TC-ETEXT-3828_Search_01]
    Then I expect that element ".icon-white.searchIcon" becomes visible

Scenario: Should open the search drawer [TC-ETEXT-3828_Search_02]
    When I click on the element ".icon-white.searchIcon"
    Then I expect that element ".searchCompContainer" becomes visible

Scenario: UI of search drawer [TC-ETEXT-3828_Search_03, TC-ETEXT-3828_Search_04, TC-ETEXT-3828_Search_05, TC-ETEXT-3828_Search_13]
    Then I expect that element "#search__input" becomes visible
    And I expect that element ".search__no-results_header" contains the text "No Recent Searches found."
    And I expect that element ".search__no-results_text" contains the text "You can search by word or phrase, glossary term, chapter or section"
    When I set "304" to the inputfield "#search__input"
    Then I expect that element ".close" becomes visible
    And I expect that element ".content" becomes visible

Scenario: Should empty search text box on clicking 'X' icon [TC-ETEXT-3828_Search_10, TC-ETEXT-3828_Search_42]
    When I click on the element ".close"
    Then I expect that element "#search__input" is empty
    And I expect that element ".search__no-results_header" contains the text "No Recent Searches found."
    When I click on the element ".icon-white.searchIcon"

Scenario: Should take user to correct searched page [TC-ETEXT-3828_Search_09]
    When I click on search icon ".icon-white.searchIcon" and in element "#search__input" set page as "304" and click on the searched term
    Then I expect that element "[name='eText MP3']" becomes visible
    When I click on the element ".icon-white.searchIcon"

Scenario Outline: Search with invalid search criteria & Stop Words (the, is, at, which, and on) [TC-ETEXT-3828_Search_30]
    When I set "<criteria>" to the inputfield "#search__input"
    Then I expect that element ".search__no-results_header" contains the text "No Recent Searches found."
    When I click on the element ".close"
    Examples:
    | criteria |
    | InvalidText |
    | is |
    | at |
    | which |
    | on |

Scenario: Should close the search drawer on clicking anywhere on the page [TC-ETEXT-3828_Search_15]
    When I click on the element ".eT1headerBar>div>h1"
    Then I expect that element ".searchCompContainer" becomes not visible

Scenario Outline: Should navigate to searched page with different formats (Open issue ETEXt-4056 for the last search criteria (0 5)) [TC-ETEXT-3828_Search_19, 20, 21, 22]
    When I click on search icon ".icon-white.searchIcon" and in element "#search__input" set page as "<pageNum>" and click on the searched term
    Then I wait on element "<assetName>" for 120000ms to be visible
    Examples:
    | pageNum | assetName |
    | A-A | [name='Page A-A'] |
    | A1 | [name='Page A1'] |
    | iii | [name='Page iii'] |
    | 4th | [name='Page 4th'] |

Scenario Outline: multiword search with '+' sign in-between [TC-ETEXT-3828_Search_27]
    When I click on the element ".icon-white.searchIcon"
    And I set "carbon+atom" to the inputfield "#search__input"
    Then I expect that element ".content" contains the text "carbon atom"
    When I press esc key

Scenario Outline: multiword search with '-' sign in-between [TC-ETEXT-3828_Search_28]
    When I click on the element ".icon-white.searchIcon"
    And I set "cylinder-something" to the inputfield "#search__input"
    Then I expect that element ".content" contains the text "cylinder-something"
    When I press esc key

Scenario: Search box closes when user navigates to next page [TC-ETEXT-3828_Search_46]
    When I click on the element ".icon-white.searchIcon"
    And I click on the element ".nextContent"
    Then I wait on element "#docViewer_ViewContainer_PageContainer_0" for 120000ms to be visible
    And I expect that element ".searchCompContainer" becomes not visible

Scenario: Should update search results on editing the search Term [TC-ETEXT-3828_Search_18, TC-ETEXT-3828_Search_41]
    When I click on the element ".icon-white.searchIcon"
    Then I expect that element ".searchCompContainer" becomes visible
    When I set "atom" to the inputfield "#search__input"
    Then I expect that element "span*=299" becomes visible
    When I set "s" to the inputfield "#search__input"
    Then I expect that element "span*=A1" becomes visible
    When I press esc key


Scenario: Should redirect to Login page on Sign-out after performing search [TC-ETEXT-3828_Search_44]
    When I click on search icon ".icon-white.searchIcon" and in element "#search__input" set page as "304" and click on the searched term
    Then I expect that element "[name='eText MP3']" becomes visible
    When I click on the element ".pe-icon--chevron-back-18"
    Then I wait on element ".signoutBtn>div>button" for 3000ms to be visible
    And I click on the element ".signoutBtn>div>button"
    Then I wait on element "#username" for 3000ms to be visible

Scenario: Search result of a title should not reflect in another title [TC-ETEXT-3828_Search_43]
    When I set "et1qa_edu1" value in element "#username" and "Pa55word@123" value in element "#password" and click on "#mainButton" button
    Then I wait on element "#bookshelf" for 120000ms to be visible
    When I click on the button "p*=DNT_TEST_Asset"
    Then I wait on element "#docViewer_ViewContainer_PageContainer_0" for 120000ms to be visible
    When I click on search icon ".icon-white.searchIcon" and in element "#search__input" set page as "B" and click on the searched term
    Then I expect that element "[name='Page number Type']" becomes visible
    When I click on the element ".pe-icon--chevron-back-18"
    And I click on the button "p*=audio_492_HTTPS"
    Then I wait on element "#docViewer_ViewContainer_PageContainer_0" for 120000ms to be visible
    When I click on the element ".icon-white.searchIcon"
    Then I expect that element ".searchCompContainer" becomes visible
    And I expect that element ".search__no-results_header" contains the text "No Recent Searches found."
