Feature:
    In order to keep my product stable
    As a developer or product manager
    I want to make sure that everything works as expected

Scenario: Bookshelf should be visible
    Then I expect that element "#bookshelf" becomes visible

Scenario: Should launch the book
    When I click on the button "p*=Audio_492_Simp_Automation"
    And I pause for 5000ms
    Then I expect that element "#docViewer_ViewContainer_PageContainer_0" becomes visible


Scenario: Should navigate to the page number 304 using search bar for Relative Assets
    When I click on the element ".icon-white.searchIcon"
    Then I expect that element ".searchCompContainer" becomes visible
    When I set "304" to the inputfield "#search__input"
    Then I expect that element "span*=304" becomes visible
    When I click on the element "span*=304"
    And I pause for 5000ms
    Then I expect that element "#docViewer_ViewContainer_PageContainer_0" becomes visible
    And I expect that element "[name='eText MP3']" becomes visible

Scenario Outline: Check the functionality of Relative Assets [Hotspots & Region]
    When I click on the element "<elem_rel>"
    Then I expect that element "<opened_window>" becomes visible
    When I press esc key
    Then I expect that element "<opened_window>" becomes not visible
    Examples:
    | elem_rel | opened_window |
    | [name='eText MP3'] | .aquila-audio-player.ui-draggable.ui-draggable-handle |
#   | [name='eText FLV'] | .video-player-header.hide-overlay>div>div |
    | [name='eText Image'] | .image-current.ril-image-current.image___2FLq2 |
    | [name='eText Region MP3'] | .aquila-audio-player.ui-draggable.ui-draggable-handle |
#   | [name='eText Region FLV'] | .video-player-header.hide-overlay>div>div |
    | [name='eText Region Image'] | .image-current.ril-image-current.image___2FLq2 |

Scenario Outline: Check the functionality of Relative Assets with "URL" Type [Hotspots & Region]
    When I click on the element "<elem_Rel_url>"
    And I focus the last opened tab
    Then I expect that element ".main_content" becomes visible
    When I close the last opened tab
    Examples:
    | elem_Rel_url |
    | [name='eText HTML'] |
    | [name='eText VLA'] |
    | [name='eText Chromeless'] |
    | [name='eText Region URL'] |
    | [name='eText Region VLA'] |
    | [name='eText Region Chromeless'] |

Scenario: Should navigate to the page number 305 using next button for Absolute Assets
    When I click on the element ".nextContent"
    And I pause for 20000ms
    Then I expect that element "#docViewer_ViewContainer_PageContainer_0" becomes visible

Scenario Outline: Check the functionality of Absolute Assets [Hotspots & Region]
    When I click on the element "<elem_abs>"
    Then I expect that element "<opened_window_abs>" becomes visible
    When I press esc key
    Then I expect that element "<opened_window_abs>" becomes not visible
    Examples:
    | elem_abs | opened_window_abs |
    | [name='eText MP3'] | .aquila-audio-player.ui-draggable.ui-draggable-handle |
#   | [name='eText FLV'] | .video-player-header.hide-overlay>div>div |
    | [name='eText H264'] | .play-replay-icon |
    | [name='eText Glossary Term'] | .mm-popup__box.glosspopUp |
    | [name='eText Image'] | .image-current.ril-image-current.image___2FLq2 |
    | [name='eText Region MP3'] | .aquila-audio-player.ui-draggable.ui-draggable-handle |
#   | [name='eText Region FLV'] | .video-player-header.hide-overlay>div>div |
    | [name='eText Region H264'] | .play-replay-icon |
    | [name='eText Region Glossary Term'] | .mm-popup__box.glosspopUp |
    | [name='eText Region Image'] | .image-current.ril-image-current.image___2FLq2 |

Scenario Outline: Check the functionality of Absolute Assets with "URL" Type [Hotspots & Region]
    When I click on the element "<elem_abs_url>"
    And I focus the last opened tab
    Then I expect that element ".main_content" becomes visible
    When I close the last opened tab
    Examples:
    | elem_abs_url |
    | [name='eText HTML'] |
    | [name='eText VLA'] |
    | [name='eText Chromeless'] |
    | [name='eText Region URL'] |
    | [name='eText Region VLA'] |
    | [name='eText Region Chromeless'] |

Scenario Outline: Check that LTI & Jazz assets not visible to username
    Then I expect that element "<LTI_JAZZ>" is not visible
    Examples:
    | LTI_JAZZ |
    | [name='ext LTI Link'] |
    | [name='eText Jazz'] |

Scenario: Verify the launch of SPP video asset
    When I click on the element "[name='Teacher PSP']"
    Then I expect that element "#sppModalHeader" becomes visible
    When I click on the element "#sppCloseBtn"
    Then I expect that element "#sppModalHeader" is not visible

#Scenario: Verify the launch of SPP Audio (HTML) [Will work only in Production Environment]
#    When I move to element "[name='SPP Audio HTML']" with an offset of 0,0
#    And I click on the element "[name='SPP Audio HTML']"
#    And I focus the last opened tab
#    Then I expect that element ".top-row.embedVideo" becomes visible
#    When I close the last opened tab

Scenario Outline: Check the SPP Video with Flag On/Off from Authoring
    When I click on the element "<spp_video>"
    Then I expect that element "<player_elem>" becomes visible
    When I press esc key
    Then I expect that element "<player_elem>" becomes not visible
    Examples:
    | spp_video | player_elem |
    | [name='SPP Video Flag OFF'] | #sppModalHeader |
    | [name='SPP Video Flag On'] | #sppModalHeader |

#Below scenario is not working. WIP
#Scenario: Verify the working of Transparent Region hotspot
#    Given I expect that element "[name='Transparent Region Hotspot']" is not visible
#    When I move to element "#docViewer" with an offset of 807,354
#    Then I expect that element "[name='Transparent Region Hotspot']" becomes visible
#    When I click on the element "[name='Transparent Region Hotspot']"
#    And I focus the last opened tab
#    Then I expect that element ".image-current.ril-image-current.image___2FLq2" becomes visible
#    When I close the last opened tab

Scenario: Verify the display of Assets for Teacher user (All & Teacher should be visible)
    Then I expect that element "[name='Teacher PSP']" is visible
    And I expect that element "[name='Student XLS']" is not visible
    And I click on the element ".pe-icon--chevron-back-18"
    Then I wait on element ".signoutBtn>div>button" for 3000ms to be visible
    And I click on the element ".signoutBtn>div>button"
    Then I wait on element "#username" for 3000ms to be visible

Scenario: Verify the dispaly of Assets for Stdent user on page 305
    When I set "et1_qaautomation_stu2" to the inputfield "#username"
    And I set "Pa55word@123" to the inputfield "#password"
    And I scroll to element "#mainButton"
    And I click on the button "#mainButton"
    Then I wait on element "#bookshelf" for 10000ms to be visible
    When I click on the element ".icon-white.searchIcon"
    Then I expect that element ".searchCompContainer" becomes visible
    When I set "305" to the inputfield "#search__input"
    Then I expect that element "span*=305" becomes visible
    When I click on the element "span*=305"
    Then I wait on element "[name='eText MP3']" for 5000ms to be visible
    Then I expect that element "[name='Teacher PSP']" is not visible
    And I expect that element "[name='Student XLS']" is visible
