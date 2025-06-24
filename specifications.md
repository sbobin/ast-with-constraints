# Specification Document

## AST Symbol Categories
   ID | Category |
 |----|----------|
 | C1 | Global Variables |
 | C2 | Functions |
 | C3 | Function Parameters |
 | C4 | Function Return Values |
 | C5 | Local Variables |
 | C6 | Types |
 | C7 | Structs |
 | C8 | Struct Fields |
 | C9 | Classes |
 | C10 | Class Members |
 | C11 | Enumerations |
 | C12 | Enumeration Values |
 | C13 | Macros |
 | C14 | Unions |
 | C15 | Union Fields |
 | C16 | Namespaces |
 | C17 | Namespace Members |
 | C18 | Templates |
 | C19 | Template Specializations |
 | C20 | Typedefs |
 | C21 | Constants |
 | C22 | Labels |
 | C23 | Preprocessor Directives |

## User Interface Layout
 | ID | Requirement |
 |----|-------------|
 | UI1 | The UI should be divided into two main panels: a left panel and a right panel. |
 | UI2 | Panels should resize appropriately when the window size changes. |

## AST Display and Interaction
 | ID | Requirement |
 |----|-------------|
 | AD1 | The left panel should display the AST symbols grouped by categories for a given C or C++ source code. |
 | AD2 | The left panel should render the AST symbols in a categorized tree-like structure. |
 | AD3 | Each symbol in the categorized AST should be clickable. |
 | AD4 | When a user clicks on a symbol in the AST, the symbol should be highlighted to indicate selection. |
 | AD5 | Users should be able to easily navigate the categorized AST, expanding and collapsing nodes as needed. |
 | AD6 | Symbols on the left panel should have appropriate icons to identify those with modified values (values different from default). |

## Right Panel and Constraints Form
 | ID | Requirement |
 |----|-------------|
 | RP1 | The right panel should be initially empty or display a placeholder message indicating that no symbol is selected. |
 | RP2 | The right panel should update to display a form corresponding to the selected symbol, with form fields and options dynamically adjusted based on the symbol type. |
 | RP3 | The form in the right panel should allow users to specify constraints for the selected symbol. |
 | RP4 | The form should include fields relevant to the type of symbol selected (e.g., variables, functions). |
 | RP5 | Common constraint fields might include data type restrictions, value ranges, or custom annotations. |

## Input and Parsing
 | ID | Requirement |
 |----|-------------|
 | IP1 | The UI should accept C or C++ source code as input, either through a file upload or direct text input. |
 | IP2 | The source code should be parsed to generate the categorized AST displayed in the left panel. |

## Constraints Management
 | ID | Requirement |
 |----|-------------|
 | CM1 | Constraints specified in the form should be saved separately and associated with the corresponding symbol in the AST using the symbol's unique ID. |
 | CM2 | Users should be able to edit constraints or set them back to their default values as needed. |

## User Feedback and Error Handling
 | ID | Requirement |
 |----|-------------|
 | FE1 | The UI should provide visual feedback for user actions, such as selecting a symbol or applying constraints. |
 | FE2 | The UI should handle errors gracefully, such as invalid source code input or issues with parsing the AST. |
 | FE3 | Users should receive clear error messages to help them resolve any issues. |

## Documentation and Help
 | ID | Requirement |
 |----|-------------|
 | DH1 | Provide tooltips or help text to guide users on how to interact with the UI and specify constraints. |
 | DH2 | Include documentation or examples to illustrate the types of constraints that can be applied. |

## Platform Compatibility
 | ID | Requirement |
 |----|-------------|
 | PC1 | The program should be compatible and functional on Linux, Windows, and macOS operating systems. |
