Feature:
    In order to keep my product stable
    As a developer or product manager
    I want to make sure that everything works as expected around Bookmark feature

Scenario: Bookshelf should be visible after successful login
    Then I expect that element "#bookshelf" becomes visible

Scenario: Should launch the book (TC-React-Book_Generic_13)
    When I click on the button "p*=Audio_492_Simp_Automation"
    Then I expect that element "#docViewer_ViewContainer_PageContainer_0" becomes visible 
    
Scenario: Verify the presence of Bookmark icon at the header (Viewer_ETEXT-3823_Bookmarks_TC_1, 11)
        When I click on the element ".nextContent"
        And I pause for 5000ms
        Then I expect that element ".bookmarkIcon" becomes visible
      
Scenario: Verify bookmarks section of TOC(table of content) is empty when there is no bookmarks within the title (Viewer_ETEXT-3823_Bookmarks_TC_2)
        When I click on the element ".drawerIcon.icon-white"
        And I click on the element "#bookmarks"
        Then I expect that element ".o-bookmark-content" becomes not visible
        And I expect that element ".o-bookmark-empty-message" contains the text "Your bookmarks will appear here."
  
    # (verify click operation to close the TOC drawer) 
       When I click on the element ".drawerWrap" 
       Then I expect that element "#docViewer_ViewContainer_PageContainer_0" becomes visible

Scenario: Verify the creation of Bookmark icon (Viewer_ETEXT-3823_Bookmarks_TC_3, 12)
        When I click on the element ".bookmarkIcon"
        And I pause for 5000ms
        Then I expect that the attribute "aria-label" from element ".bookmarkIcon" is not "Click to bookmark the page"


Scenario: Verify the presence of Bookmark on TOC along with Date and Delete icon (Viewer_ETEXT-3823_Bookmarks_TC_5, 14)
       When I click on the element ".drawerIcon.icon-white"
       Then I expect that element ".tabCompwrapper" becomes visible
       And I expect that element "#bookmarks" becomes visible
       When I click on the element "#bookmarks"
       Then I expect that element ".o-bookmark-content" becomes visible
       And I expect that element ".o-bookmark-date" becomes visible
       When I move to element ".o-bookmark-date" with an offset of 10,0
      # When I scroll to element "o-bookmark-date" with an offset of 10,0
      Then I expect that element ".remove" becomes visible

   # Checking the visibility of Delete icon in TOC drawer (Viewer_ETEXT-3823_Bookmarks_TC_6, 7, 8)
      When I click on the element ".remove"
      Then I expect that element ".handleCloseIcon" becomes visible
     And I expect that element ".cancelBtn" becomes visible
     And I expect that element ".deleteBtn" becomes visible
     When I click on the element ".cancelBtn"   
     Then I expect that element ".o-bookmark-content" becomes visible
     
   # Verifying Close Button functionality (Viewer_ETEXT-3823_Bookmarks_TC_9)
      When I move to element ".o-bookmark-date" with an offset of 10,0
      Then I expect that element ".remove" becomes visible
      When I click on the element ".remove"
      Then I expect that element ".handleCloseIcon" becomes visible
      When I click on the element ".handleCloseIcon"
      Then I expect that element ".o-bookmark-content" becomes visible
        
   # verify Delete operation from the TOC drawer (Viewer_ETEXT-3823_Bookmarks_TC_10)
      When I move to element ".o-bookmark-date" with an offset of 10,0
      Then I expect that element ".remove" becomes visible
      When I click on the element ".remove"
      Then I expect that element ".deleteBtn" becomes visible
      When I click on the element ".deleteBtn"
      Then I expect that element ".o-bookmark-content" becomes not visible
              
   # (verify click operation to close the TOC drawer) 
       #When I click on the element ".drawerWrap" 
       When I press esc key
       Then I expect that element "#docViewer_ViewContainer_PageContainer_0" becomes visible

  
Scenario: Verify the removal of Bookmark icon (Viewer_ETEXT-3823_Bookmarks_TC_4, 13)
        When I click on the element ".bookmarkIcon"
        And I pause for 5000ms
        Then I expect that the attribute "aria-label" from element ".bookmarkIcon" is not "Click to bookmark the page"
        When I click on the button ".bookmarkIcon"
        And I pause for 5000ms
        Then I expect that the attribute "aria-label" from element ".bookmarkIcon" is not "Click to remove the bookmark"



