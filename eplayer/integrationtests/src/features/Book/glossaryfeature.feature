Feature:
    In order to keep my product stable
    As a developer or product manager
    I want to make sure that everything works as expected on the Login page

Scenario: Should launch the book
    Then I wait on element "#bookshelf" for 5000ms to be visible
    When I click on the button "p*=Audio_492_Simp_Automation"
    Then I wait on element "#docViewer_ViewContainer_PageContainer_0" for 120000ms to be visible

Scenario: Should navigate to the page number 305 using search bar for Glossary Term Assets
    When I click on the element ".icon-white.searchIcon"
    Then I expect that element ".searchCompContainer" becomes visible
    When I set "305" to the inputfield "#search__input"
    Then I expect that element "span*=305" becomes visible

Scenario: Glossary Term should be visible [Viewer_ETEXT-3829_Glossary_TC_2]
    When I click on the element "span*=305"
    Then I wait on element "[name='eText Glossary Term']" for 120000ms to be visible

Scenario: Check the functionality of the Glossary Term Assets [Viewer_ETEXT-3829_Glossary_TC_3][Viewer_ETEXT-3829_Glossary_TC_4]
    When I move to element "[name='SPP Audio HTML']" with an offset of 0,0
    Then I expect that element "[name='eText Glossary Term']" becomes visible
    And I click on the element "[name='eText Glossary Term']"
    Then I expect that element ".mm-popup__box.glosspopUp" becomes visible

Scenario: Close Glossary term pop-up by clicking any header component on the page [Viewer_ETEXT-3829_Glossary_TC_20]
    When I click on the element ".icon-white.prefIcon"
    Then I expect that element ".mm-popup__box.glosspopUp" becomes not visible
    When I click on the element ".moreIcon>div>button"
    And I press esc key

Scenario: Verify the glossary description
    When I click on the element "[name='eText Glossary Term']"
    Then I expect that element ".mm-popup__box.glosspopUp" becomes visible
    And I expect that element ".mm-popup__box__body" contains the text "bacteriophage DNA that is embedded in the bacterial host’s DNA"

Scenario: Close glossary pop-up by clicking anywhere on the page [Viewer_ETEXT-3829_Glossary_TC_16]
    When I click on the element ".prevContent"
    Then I wait on element ".pe-icon--chevron-back-18" for 5000ms to be visible
    And I expect that element ".mm-popup__box.glosspopUp" becomes not visible

Scenario: should be able to logout from Book
   When I click on the element ".pe-icon--chevron-back-18"
   Then I wait on element ".signoutBtn>div>button" for 3000ms to be visible
   When I click on the element ".signoutBtn>div>button"
   Then I wait on element "#username" for 3000ms to be visible

Scenario: Should login with other credentials and navigate to page "B" for Glossary term
  When I set "et1qa_edu1" value in element "#username" and "Pa55word@123" value in element "#password" and click on "#mainButton" button
  Then I wait on element "#bookshelf" for 10000ms to be visible
  When I click on the button "p*=gls_test1"
  Then I wait on element "#docViewer_ViewContainer_PageContainer_0" for 120000ms to be visible
  When I click on search icon ".icon-white.searchIcon" and in element "#search__input" set page as "B" and click on the searched term
  Then I wait on element "[name='Glossary region']" for 120000ms to be visible

Scenario: Verify the glossary description containing mathematical expressions, special chars, accented chars and International chars [Viewer_ETEXT-3829_Glossary_TC_9][Viewer_ETEXT-3829_Glossary_TC_10][Viewer_ETEXT-3829_Glossary_TC_11][Viewer_ETEXT-3829_Glossary_TC_12][Viewer_ETEXT-3829_Glossary_TC_13][Viewer_ETEXT-3829_Glossary_TC_19]
  When I click on the element "[name='Glossary Region']"
  Then I expect that element ".mm-popup__box.glosspopUp" becomes visible
  And I expect that element ".mm-popup__box__body" contains the text "a compound that forms hydrogen ions (H+) in solution; a solution with a pH of less than 7. Sp_ci@l Char. (n / 3) + 4=x. À, È, Ì, Ò, Ù, à, è, ì, ò, ù. This is a test glossary defination having mathematical expressions, special characters, international characters with a long description."

Scenario: Verify the glossary pop-up when the page is zoomed-in [Viewer_ETEXT-3829_Glossary_TC_7]
  When I click on the element ".icon-white.prefIcon"
  And I press "ArrowRight"
  Then I expect that the attribute "value" from element "#numInput" is "1.1"
  When I click on the element "[name='Glossary Region']"
  Then I expect that element ".mm-popup__box.glosspopUp" becomes visible

Scenario: Verify the glossary pop-up when the page is zoomed-out [Viewer_ETEXT-3829_Glossary_TC_7]
  When I click on the element ".icon-white.prefIcon"
  And I press "ArrowLeft"
  Then I expect that the attribute "value" from element "#numInput" is "0.9"
  When I click on the element "[name='Glossary Region']"
  Then I expect that element ".mm-popup__box.glosspopUp" becomes visible
