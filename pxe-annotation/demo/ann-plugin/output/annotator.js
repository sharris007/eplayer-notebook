var locale_data = {
  "en-US":{
	"delete" : "Delete",
	"edit" : "Edit",
	"save" : "Save",
	"cancel" : "Cancel",
	"green":"Green",
	"pink":"Pink",
	"yellow":"Yellow",
	"share":"Share",
	"print":"Print",
	"add_note":"Add a note...",
	"confirm":"Confirm",
	"addtitle":"Add a title",
	"charleft":"characters left",
	"close":"Close",
	"mainIdeas" : "Main ideas",
	"questions" : "Questions",
	"observations" : "Observations",
	"instructor":"From Instructor"
  },
  "fr" : {
	"delete":"Supprimer",
	"edit":"Modifier",
	"cancel":"Annuler",
	"green":"Vert",
	"pink":"Rose",
	"yellow":"Jaune",
	"none":"aucun",
	"share":"Partage",
	"print":"Imprimer",
	"write_note":"Ajouter une note.",
	"save":"Sauvegarder",
	"confirm":"Confirmer",
	"addtitle":"Ajouter un titre",
	"charleft":"Nombre de caractères restants",
	"close":"Fermer",
	"instructor":"De l'instructeur"
  }
};
;;(function () {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (exports) {
	'use strict';

	function inherits(parent, child) {
		var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

		var extended = Object.create(parent.prototype);
		for (var p in props) {
			extended[p] = props[p];
		}
		extended.constructor = child;
		child.prototype = extended;
		return child;
	}

	var defaults = {
		defaultProtocol: 'http',
		events: null,
		format: noop,
		formatHref: noop,
		nl2br: false,
		tagName: 'a',
		target: typeToTarget,
		validate: true,
		ignoreTags: [],
		attributes: null,
		className: 'linkified' };

	function Options(opts) {
		opts = opts || {};

		this.defaultProtocol = opts.defaultProtocol || defaults.defaultProtocol;
		this.events = opts.events || defaults.events;
		this.format = opts.format || defaults.format;
		this.formatHref = opts.formatHref || defaults.formatHref;
		this.nl2br = opts.nl2br || defaults.nl2br;
		this.tagName = opts.tagName || defaults.tagName;
		this.target = opts.target || defaults.target;
		this.validate = opts.validate || defaults.validate;
		this.ignoreTags = [];

		// linkAttributes and linkClass is deprecated
		this.attributes = opts.attributes || opts.linkAttributes || defaults.attributes;
		this.className = opts.className || opts.linkClass || defaults.className;

		// Make all tags names upper case

		var ignoredTags = opts.ignoreTags || defaults.ignoreTags;
		for (var i = 0; i < ignoredTags.length; i++) {
			this.ignoreTags.push(ignoredTags[i].toUpperCase());
		}
	}

	Options.prototype = {
		/**
   * Given the token, return all options for how it should be displayed
   */
		resolve: function resolve(token) {
			var href = token.toHref(this.defaultProtocol);
			return {
				formatted: this.get('format', token.toString(), token),
				formattedHref: this.get('formatHref', href, token),
				tagName: this.get('tagName', href, token),
				className: this.get('className', href, token),
				target: this.get('target', href, token),
				events: this.getObject('events', href, token),
				attributes: this.getObject('attributes', href, token)
			};
		},


		/**
   * Returns true or false based on whether a token should be displayed as a
   * link based on the user options. By default,
   */
		check: function check(token) {
			return this.get('validate', token.toString(), token);
		},


		// Private methods

		/**
   * Resolve an option's value based on the value of the option and the given
   * params.
   * @param [String] key Name of option to use
   * @param operator will be passed to the target option if it's method
   * @param [MultiToken] token The token from linkify.tokenize
   */
		get: function get(key, operator, token) {
			var option = this[key];

			if (!option) {
				return option;
			}

			switch (typeof option === 'undefined' ? 'undefined' : _typeof(option)) {
				case 'function':
					return option(operator, token.type);
				case 'object':
					var optionValue = option[token.type] || defaults[key];
					return typeof optionValue === 'function' ? optionValue(operator, token.type) : optionValue;
			}

			return option;
		},
		getObject: function getObject(key, operator, token) {
			var option = this[key];
			return typeof option === 'function' ? option(operator, token.type) : option;
		}
	};

	/**
  * Quick indexOf replacement for checking the ignoreTags option
  */
	function contains(arr, value) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] === value) {
				return true;
			}
		}
		return false;
	}

	function noop(val) {
		return val;
	}

	function typeToTarget(href, type) {
		return type === 'url' ? '_blank' : null;
	}

	var options = Object.freeze({
		defaults: defaults,
		Options: Options,
		contains: contains
	});

	function createStateClass() {
		return function (tClass) {
			this.j = [];
			this.T = tClass || null;
		};
	}

	/**
 	A simple state machine that can emit token classes
 
 	The `j` property in this class refers to state jumps. It's a
 	multidimensional array where for each element:
 
 	* index [0] is a symbol or class of symbols to transition to.
 	* index [1] is a State instance which matches
 
 	The type of symbol will depend on the target implementation for this class.
 	In Linkify, we have a two-stage scanner. Each stage uses this state machine
 	but with a slighly different (polymorphic) implementation.
 
 	The `T` property refers to the token class.
 
 	TODO: Can the `on` and `next` methods be combined?
 
 	@class BaseState
 */
	var BaseState = createStateClass();
	BaseState.prototype = {
		defaultTransition: false,

		/**
  	@method constructor
  	@param {Class} tClass Pass in the kind of token to emit if there are
  		no jumps after this state and the state is accepting.
  */

		/**
  	On the given symbol(s), this machine should go to the given state
  		@method on
  	@param {Array|Mixed} symbol
  	@param {BaseState} state Note that the type of this state should be the
  		same as the current instance (i.e., don't pass in a different
  		subclass)
  */
		on: function on(symbol, state) {
			if (symbol instanceof Array) {
				for (var i = 0; i < symbol.length; i++) {
					this.j.push([symbol[i], state]);
				}
				return this;
			}
			this.j.push([symbol, state]);
			return this;
		},


		/**
  	Given the next item, returns next state for that item
  	@method next
  	@param {Mixed} item Should be an instance of the symbols handled by
  		this particular machine.
  	@return {State} state Returns false if no jumps are available
  */
		next: function next(item) {
			for (var i = 0; i < this.j.length; i++) {
				var jump = this.j[i];
				var symbol = jump[0]; // Next item to check for
				var state = jump[1]; // State to jump to if items match

				// compare item with symbol
				if (this.test(item, symbol)) {
					return state;
				}
			}

			// Nowhere left to jump!
			return this.defaultTransition;
		},


		/**
  	Does this state accept?
  	`true` only of `this.T` exists
  		@method accepts
  	@return {Boolean}
  */
		accepts: function accepts() {
			return !!this.T;
		},


		/**
  	Determine whether a given item "symbolizes" the symbol, where symbol is
  	a class of items handled by this state machine.
  		This method should be overriden in extended classes.
  		@method test
  	@param {Mixed} item Does this item match the given symbol?
  	@param {Mixed} symbol
  	@return {Boolean}
  */
		test: function test(item, symbol) {
			return item === symbol;
		},


		/**
  	Emit the token for this State (just return it in this case)
  	If this emits a token, this instance is an accepting state
  	@method emit
  	@return {Class} T
  */
		emit: function emit() {
			return this.T;
		}
	};

	/**
 	State machine for string-based input
 
 	@class CharacterState
 	@extends BaseState
 */
	var CharacterState = inherits(BaseState, createStateClass(), {
		/**
  	Does the given character match the given character or regular
  	expression?
  		@method test
  	@param {String} char
  	@param {String|RegExp} charOrRegExp
  	@return {Boolean}
  */
		test: function test(character, charOrRegExp) {
			return character === charOrRegExp || charOrRegExp instanceof RegExp && charOrRegExp.test(character);
		}
	});

	/**
 	State machine for input in the form of TextTokens
 
 	@class TokenState
 	@extends BaseState
 */
	var TokenState = inherits(BaseState, createStateClass(), {

		/**
   * Similar to `on`, but returns the state the results in the transition from
   * the given item
   * @method jump
   * @param {Mixed} item
   * @param {Token} [token]
   * @return state
   */
		jump: function jump(token) {
			var tClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			var state = this.next(new token('')); // dummy temp token
			if (state === this.defaultTransition) {
				// Make a new state!
				state = new this.constructor(tClass);
				this.on(token, state);
			} else if (tClass) {
				state.T = tClass;
			}
			return state;
		},


		/**
  	Is the given token an instance of the given token class?
  		@method test
  	@param {TextToken} token
  	@param {Class} tokenClass
  	@return {Boolean}
  */
		test: function test(token, tokenClass) {
			return token instanceof tokenClass;
		}
	});

	/**
 	Given a non-empty target string, generates states (if required) for each
 	consecutive substring of characters in str starting from the beginning of
 	the string. The final state will have a special value, as specified in
 	options. All other "in between" substrings will have a default end state.
 
 	This turns the state machine into a Trie-like data structure (rather than a
 	intelligently-designed DFA).
 
 	Note that I haven't really tried these with any strings other than
 	DOMAIN.
 
 	@param {String} str
 	@param {CharacterState} start State to jump from the first character
 	@param {Class} endToken Token class to emit when the given string has been
 		matched and no more jumps exist.
 	@param {Class} defaultToken "Filler token", or which token type to emit when
 		we don't have a full match
 	@return {Array} list of newly-created states
 */
	function stateify(str, start, endToken, defaultToken) {
		var i = 0,
		    len = str.length,
		    state = start,
		    newStates = [],
		    nextState = void 0;

		// Find the next state without a jump to the next character
		while (i < len && (nextState = state.next(str[i]))) {
			state = nextState;
			i++;
		}

		if (i >= len) {
			return [];
		} // no new tokens were added

		while (i < len - 1) {
			nextState = new CharacterState(defaultToken);
			newStates.push(nextState);
			state.on(str[i], nextState);
			state = nextState;
			i++;
		}

		nextState = new CharacterState(endToken);
		newStates.push(nextState);
		state.on(str[len - 1], nextState);

		return newStates;
	}

	function createTokenClass() {
		return function (value) {
			if (value) {
				this.v = value;
			}
		};
	}

	/******************************************************************************
 	Text Tokens
 	Tokens composed of strings
 ******************************************************************************/

	/**
 	Abstract class used for manufacturing text tokens.
 	Pass in the value this token represents
 
 	@class TextToken
 	@abstract
 */
	var TextToken = createTokenClass();
	TextToken.prototype = {
		toString: function toString() {
			return this.v + '';
		}
	};

	function inheritsToken(value) {
		var props = value ? { v: value } : {};
		return inherits(TextToken, createTokenClass(), props);
	}

	/**
 	A valid domain token
 	@class DOMAIN
 	@extends TextToken
 */
	var DOMAIN = inheritsToken();

	/**
 	@class AT
 	@extends TextToken
 */
	var AT = inheritsToken('@');

	/**
 	Represents a single colon `:` character
 
 	@class COLON
 	@extends TextToken
 */
	var COLON = inheritsToken(':');

	/**
 	@class DOT
 	@extends TextToken
 */
	var DOT = inheritsToken('.');

	/**
 	A character class that can surround the URL, but which the URL cannot begin
 	or end with. Does not include certain English punctuation like parentheses.
 
 	@class PUNCTUATION
 	@extends TextToken
 */
	var PUNCTUATION = inheritsToken();

	/**
 	The word localhost (by itself)
 	@class LOCALHOST
 	@extends TextToken
 */
	var LOCALHOST = inheritsToken();

	/**
 	Newline token
 	@class NL
 	@extends TextToken
 */
	var NL = inheritsToken('\n');

	/**
 	@class NUM
 	@extends TextToken
 */
	var NUM = inheritsToken();

	/**
 	@class PLUS
 	@extends TextToken
 */
	var PLUS = inheritsToken('+');

	/**
 	@class POUND
 	@extends TextToken
 */
	var POUND = inheritsToken('#');

	/**
 	Represents a web URL protocol. Supported types include
 
 	* `http:`
 	* `https:`
 	* `ftp:`
 	* `ftps:`
 
 	@class PROTOCOL
 	@extends TextToken
 */
	var PROTOCOL = inheritsToken();

	/**
 	Represents the start of the email URI protocol
 
 	@class MAILTO
 	@extends TextToken
 */
	var MAILTO = inheritsToken('mailto:');

	/**
 	@class QUERY
 	@extends TextToken
 */
	var QUERY = inheritsToken('?');

	/**
 	@class SLASH
 	@extends TextToken
 */
	var SLASH = inheritsToken('/');

	/**
 	@class UNDERSCORE
 	@extends TextToken
 */
	var UNDERSCORE = inheritsToken('_');

	/**
 	One ore more non-whitespace symbol.
 	@class SYM
 	@extends TextToken
 */
	var SYM = inheritsToken();

	/**
 	@class TLD
 	@extends TextToken
 */
	var TLD = inheritsToken();

	/**
 	Represents a string of consecutive whitespace characters
 
 	@class WS
 	@extends TextToken
 */
	var WS = inheritsToken();

	/**
 	Opening/closing bracket classes
 */

	var OPENBRACE = inheritsToken('{');
	var OPENBRACKET = inheritsToken('[');
	var OPENANGLEBRACKET = inheritsToken('<');
	var OPENPAREN = inheritsToken('(');
	var CLOSEBRACE = inheritsToken('}');
	var CLOSEBRACKET = inheritsToken(']');
	var CLOSEANGLEBRACKET = inheritsToken('>');
	var CLOSEPAREN = inheritsToken(')');

	var AMPERSAND = inheritsToken('&');

	var text = Object.freeze({
		Base: TextToken,
		DOMAIN: DOMAIN,
		AT: AT,
		COLON: COLON,
		DOT: DOT,
		PUNCTUATION: PUNCTUATION,
		LOCALHOST: LOCALHOST,
		NL: NL,
		NUM: NUM,
		PLUS: PLUS,
		POUND: POUND,
		QUERY: QUERY,
		PROTOCOL: PROTOCOL,
		MAILTO: MAILTO,
		SLASH: SLASH,
		UNDERSCORE: UNDERSCORE,
		SYM: SYM,
		TLD: TLD,
		WS: WS,
		OPENBRACE: OPENBRACE,
		OPENBRACKET: OPENBRACKET,
		OPENANGLEBRACKET: OPENANGLEBRACKET,
		OPENPAREN: OPENPAREN,
		CLOSEBRACE: CLOSEBRACE,
		CLOSEBRACKET: CLOSEBRACKET,
		CLOSEANGLEBRACKET: CLOSEANGLEBRACKET,
		CLOSEPAREN: CLOSEPAREN,
		AMPERSAND: AMPERSAND
	});

	/**
 	The scanner provides an interface that takes a string of text as input, and
 	outputs an array of tokens instances that can be used for easy URL parsing.
 
 	@module linkify
 	@submodule scanner
 	@main scanner
 */

	var tlds = 'aaa|aarp|abb|abbott|abogado|ac|academy|accenture|accountant|accountants|aco|active|actor|ad|adac|ads|adult|ae|aeg|aero|af|afl|ag|agency|ai|aig|airforce|airtel|al|alibaba|alipay|allfinanz|alsace|am|amica|amsterdam|an|analytics|android|ao|apartments|app|apple|aq|aquarelle|ar|aramco|archi|army|arpa|arte|as|asia|associates|at|attorney|au|auction|audi|audio|author|auto|autos|avianca|aw|ax|axa|az|azure|ba|baidu|band|bank|bar|barcelona|barclaycard|barclays|bargains|bauhaus|bayern|bb|bbc|bbva|bcg|bcn|bd|be|beats|beer|bentley|berlin|best|bet|bf|bg|bh|bharti|bi|bible|bid|bike|bing|bingo|bio|biz|bj|black|blackfriday|bloomberg|blue|bm|bms|bmw|bn|bnl|bnpparibas|bo|boats|boehringer|bom|bond|boo|book|boots|bosch|bostik|bot|boutique|br|bradesco|bridgestone|broadway|broker|brother|brussels|bs|bt|budapest|bugatti|build|builders|business|buy|buzz|bv|bw|by|bz|bzh|ca|cab|cafe|cal|call|camera|camp|cancerresearch|canon|capetown|capital|car|caravan|cards|care|career|careers|cars|cartier|casa|cash|casino|cat|catering|cba|cbn|cc|cd|ceb|center|ceo|cern|cf|cfa|cfd|cg|ch|chanel|channel|chase|chat|cheap|chloe|christmas|chrome|church|ci|cipriani|circle|cisco|citic|city|cityeats|ck|cl|claims|cleaning|click|clinic|clinique|clothing|cloud|club|clubmed|cm|cn|co|coach|codes|coffee|college|cologne|com|commbank|community|company|compare|computer|comsec|condos|construction|consulting|contact|contractors|cooking|cool|coop|corsica|country|coupon|coupons|courses|cr|credit|creditcard|creditunion|cricket|crown|crs|cruises|csc|cu|cuisinella|cv|cw|cx|cy|cymru|cyou|cz|dabur|dad|dance|date|dating|datsun|day|dclk|de|dealer|deals|degree|delivery|dell|deloitte|delta|democrat|dental|dentist|desi|design|dev|diamonds|diet|digital|direct|directory|discount|dj|dk|dm|dnp|do|docs|dog|doha|domains|download|drive|dubai|durban|dvag|dz|earth|eat|ec|edeka|edu|education|ee|eg|email|emerck|energy|engineer|engineering|enterprises|epson|equipment|er|erni|es|esq|estate|et|eu|eurovision|eus|events|everbank|exchange|expert|exposed|express|fage|fail|fairwinds|faith|family|fan|fans|farm|fashion|fast|feedback|ferrero|fi|film|final|finance|financial|firestone|firmdale|fish|fishing|fit|fitness|fj|fk|flickr|flights|florist|flowers|flsmidth|fly|fm|fo|foo|football|ford|forex|forsale|forum|foundation|fox|fr|fresenius|frl|frogans|frontier|fund|furniture|futbol|fyi|ga|gal|gallery|gallup|game|garden|gb|gbiz|gd|gdn|ge|gea|gent|genting|gf|gg|ggee|gh|gi|gift|gifts|gives|giving|gl|glass|gle|global|globo|gm|gmail|gmbh|gmo|gmx|gn|gold|goldpoint|golf|goo|goog|google|gop|got|gov|gp|gq|gr|grainger|graphics|gratis|green|gripe|group|gs|gt|gu|gucci|guge|guide|guitars|guru|gw|gy|hamburg|hangout|haus|hdfcbank|health|healthcare|help|helsinki|here|hermes|hiphop|hitachi|hiv|hk|hm|hn|hockey|holdings|holiday|homedepot|homes|honda|horse|host|hosting|hoteles|hotmail|house|how|hr|hsbc|ht|hu|hyundai|ibm|icbc|ice|icu|id|ie|ifm|iinet|il|im|immo|immobilien|in|industries|infiniti|info|ing|ink|institute|insurance|insure|int|international|investments|io|ipiranga|iq|ir|irish|is|iselect|ist|istanbul|it|itau|iwc|jaguar|java|jcb|je|jetzt|jewelry|jlc|jll|jm|jmp|jo|jobs|joburg|jot|joy|jp|jpmorgan|jprs|juegos|kaufen|kddi|ke|kerryhotels|kerrylogistics|kerryproperties|kfh|kg|kh|ki|kia|kim|kinder|kitchen|kiwi|km|kn|koeln|komatsu|kp|kpn|kr|krd|kred|kuokgroup|kw|ky|kyoto|kz|la|lacaixa|lamborghini|lamer|lancaster|land|landrover|lanxess|lasalle|lat|latrobe|law|lawyer|lb|lc|lds|lease|leclerc|legal|lexus|lgbt|li|liaison|lidl|life|lifeinsurance|lifestyle|lighting|like|limited|limo|lincoln|linde|link|live|living|lixil|lk|loan|loans|local|locus|lol|london|lotte|lotto|love|lr|ls|lt|ltd|ltda|lu|lupin|luxe|luxury|lv|ly|ma|madrid|maif|maison|makeup|man|management|mango|market|marketing|markets|marriott|mba|mc|md|me|med|media|meet|melbourne|meme|memorial|men|menu|meo|mg|mh|miami|microsoft|mil|mini|mk|ml|mm|mma|mn|mo|mobi|mobily|moda|moe|moi|mom|monash|money|montblanc|mormon|mortgage|moscow|motorcycles|mov|movie|movistar|mp|mq|mr|ms|mt|mtn|mtpc|mtr|mu|museum|mutuelle|mv|mw|mx|my|mz|na|nadex|nagoya|name|natura|navy|nc|ne|nec|net|netbank|network|neustar|new|news|nexus|nf|ng|ngo|nhk|ni|nico|nikon|ninja|nissan|nl|no|nokia|norton|nowruz|np|nr|nra|nrw|ntt|nu|nyc|nz|obi|office|okinawa|om|omega|one|ong|onl|online|ooo|oracle|orange|org|organic|origins|osaka|otsuka|ovh|pa|page|pamperedchef|panerai|paris|pars|partners|parts|party|passagens|pe|pet|pf|pg|ph|pharmacy|philips|photo|photography|photos|physio|piaget|pics|pictet|pictures|pid|pin|ping|pink|pizza|pk|pl|place|play|playstation|plumbing|plus|pm|pn|pohl|poker|porn|post|pr|praxi|press|pro|prod|productions|prof|promo|properties|property|protection|ps|pt|pub|pw|pwc|py|qa|qpon|quebec|quest|racing|re|read|realtor|realty|recipes|red|redstone|redumbrella|rehab|reise|reisen|reit|ren|rent|rentals|repair|report|republican|rest|restaurant|review|reviews|rexroth|rich|ricoh|rio|rip|ro|rocher|rocks|rodeo|room|rs|rsvp|ru|ruhr|run|rw|rwe|ryukyu|sa|saarland|safe|safety|sakura|sale|salon|samsung|sandvik|sandvikcoromant|sanofi|sap|sapo|sarl|sas|saxo|sb|sbs|sc|sca|scb|schaeffler|schmidt|scholarships|school|schule|schwarz|science|scor|scot|sd|se|seat|security|seek|select|sener|services|seven|sew|sex|sexy|sfr|sg|sh|sharp|shell|shia|shiksha|shoes|show|shriram|si|singles|site|sj|sk|ski|skin|sky|skype|sl|sm|smile|sn|sncf|so|soccer|social|softbank|software|sohu|solar|solutions|song|sony|soy|space|spiegel|spot|spreadbetting|sr|srl|st|stada|star|starhub|statefarm|statoil|stc|stcgroup|stockholm|storage|store|studio|study|style|su|sucks|supplies|supply|support|surf|surgery|suzuki|sv|swatch|swiss|sx|sy|sydney|symantec|systems|sz|tab|taipei|taobao|tatamotors|tatar|tattoo|tax|taxi|tc|tci|td|team|tech|technology|tel|telecity|telefonica|temasek|tennis|tf|tg|th|thd|theater|theatre|tickets|tienda|tiffany|tips|tires|tirol|tj|tk|tl|tm|tmall|tn|to|today|tokyo|tools|top|toray|toshiba|total|tours|town|toyota|toys|tp|tr|trade|trading|training|travel|travelers|travelersinsurance|trust|trv|tt|tube|tui|tunes|tushu|tv|tvs|tw|tz|ua|ubs|ug|uk|unicom|university|uno|uol|us|uy|uz|va|vacations|vana|vc|ve|vegas|ventures|verisign|versicherung|vet|vg|vi|viajes|video|viking|villas|vin|vip|virgin|vision|vista|vistaprint|viva|vlaanderen|vn|vodka|volkswagen|vote|voting|voto|voyage|vu|vuelos|wales|walter|wang|wanggou|watch|watches|weather|weatherchannel|webcam|weber|website|wed|wedding|weir|wf|whoswho|wien|wiki|williamhill|win|windows|wine|wme|wolterskluwer|work|works|world|ws|wtc|wtf|xbox|xerox|xin|xperia|xxx|xyz|yachts|yahoo|yamaxun|yandex|ye|yodobashi|yoga|yokohama|youtube|yt|za|zara|zero|zip|zm|zone|zuerich|zw'.split('|'); // macro, see gulpfile.js

	var NUMBERS = '0123456789'.split('');
	var ALPHANUM = '0123456789abcdefghijklmnopqrstuvwxyz'.split('');
	var WHITESPACE = [' ', '\f', '\r', '\t', '\v', '\xA0', '\u1680', '\u180E']; // excluding line breaks

	var domainStates = []; // states that jump to DOMAIN on /[a-z0-9]/
	var makeState = function makeState(tokenClass) {
		return new CharacterState(tokenClass);
	};

	// Frequently used states
	var S_START = makeState();
	var S_NUM = makeState(NUM);
	var S_DOMAIN = makeState(DOMAIN);
	var S_DOMAIN_HYPHEN = makeState(); // domain followed by 1 or more hyphen characters
	var S_WS = makeState(WS);

	// States for special URL symbols
	S_START.on('@', makeState(AT)).on('.', makeState(DOT)).on('+', makeState(PLUS)).on('#', makeState(POUND)).on('?', makeState(QUERY)).on('/', makeState(SLASH)).on('_', makeState(UNDERSCORE)).on(':', makeState(COLON)).on('{', makeState(OPENBRACE)).on('[', makeState(OPENBRACKET)).on('<', makeState(OPENANGLEBRACKET)).on('(', makeState(OPENPAREN)).on('}', makeState(CLOSEBRACE)).on(']', makeState(CLOSEBRACKET)).on('>', makeState(CLOSEANGLEBRACKET)).on(')', makeState(CLOSEPAREN)).on('&', makeState(AMPERSAND)).on([',', ';', '!', '"', '\''], makeState(PUNCTUATION));

	// Whitespace jumps
	// Tokens of only non-newline whitespace are arbitrarily long
	S_START.on('\n', makeState(NL)).on(WHITESPACE, S_WS);

	// If any whitespace except newline, more whitespace!
	S_WS.on(WHITESPACE, S_WS);

	// Generates states for top-level domains
	// Note that this is most accurate when tlds are in alphabetical order
	for (var i = 0; i < tlds.length; i++) {
		var newStates = stateify(tlds[i], S_START, TLD, DOMAIN);
		domainStates.push.apply(domainStates, newStates);
	}

	// Collect the states generated by different protocls
	var partialProtocolFileStates = stateify('file', S_START, DOMAIN, DOMAIN);
	var partialProtocolFtpStates = stateify('ftp', S_START, DOMAIN, DOMAIN);
	var partialProtocolHttpStates = stateify('http', S_START, DOMAIN, DOMAIN);
	var partialProtocolMailtoStates = stateify('mailto', S_START, DOMAIN, DOMAIN);

	// Add the states to the array of DOMAINeric states
	domainStates.push.apply(domainStates, partialProtocolFileStates);
	domainStates.push.apply(domainStates, partialProtocolFtpStates);
	domainStates.push.apply(domainStates, partialProtocolHttpStates);

	// Protocol states
	var S_PROTOCOL_FILE = partialProtocolFileStates.pop();
	var S_PROTOCOL_FTP = partialProtocolFtpStates.pop();
	var S_PROTOCOL_HTTP = partialProtocolHttpStates.pop();
	var S_MAILTO = partialProtocolMailtoStates.pop();
	var S_PROTOCOL_SECURE = makeState(DOMAIN);
	var S_FULL_PROTOCOL = makeState(PROTOCOL); // Full protocol ends with COLON
	var S_FULL_MAILTO = makeState(MAILTO); // Mailto ends with COLON

	// Secure protocols (end with 's')
	S_PROTOCOL_FTP.on('s', S_PROTOCOL_SECURE).on(':', S_FULL_PROTOCOL);

	S_PROTOCOL_HTTP.on('s', S_PROTOCOL_SECURE).on(':', S_FULL_PROTOCOL);

	domainStates.push(S_PROTOCOL_SECURE);

	// Become protocol tokens after a COLON
	S_PROTOCOL_FILE.on(':', S_FULL_PROTOCOL);
	S_PROTOCOL_SECURE.on(':', S_FULL_PROTOCOL);
	S_MAILTO.on(':', S_FULL_MAILTO);

	// Localhost
	var partialLocalhostStates = stateify('localhost', S_START, LOCALHOST, DOMAIN);
	domainStates.push.apply(domainStates, partialLocalhostStates);

	// Everything else
	// DOMAINs make more DOMAINs
	// Number and character transitions
	S_START.on(NUMBERS, S_NUM);
	S_NUM.on('-', S_DOMAIN_HYPHEN).on(NUMBERS, S_NUM).on(ALPHANUM, S_DOMAIN); // number becomes DOMAIN

	S_DOMAIN.on('-', S_DOMAIN_HYPHEN).on(ALPHANUM, S_DOMAIN);

	// All the generated states should have a jump to DOMAIN
	for (var _i = 0; _i < domainStates.length; _i++) {
		domainStates[_i].on('-', S_DOMAIN_HYPHEN).on(ALPHANUM, S_DOMAIN);
	}

	S_DOMAIN_HYPHEN.on('-', S_DOMAIN_HYPHEN).on(NUMBERS, S_DOMAIN).on(ALPHANUM, S_DOMAIN);

	// Set default transition
	S_START.defaultTransition = makeState(SYM);

	/**
 	Given a string, returns an array of TOKEN instances representing the
 	composition of that string.
 
 	@method run
 	@param {String} str Input string to scan
 	@return {Array} Array of TOKEN instances
 */
	var run = function run(str) {

		// The state machine only looks at lowercase strings.
		// This selective `toLowerCase` is used because lowercasing the entire
		// string causes the length and character position to vary in some in some
		// non-English strings. This happens only on V8-based runtimes.
		var lowerStr = str.replace(/[A-Z]/g, function (c) {
			return c.toLowerCase();
		});
		var len = str.length;
		var tokens = []; // return value

		var cursor = 0;

		// Tokenize the string
		while (cursor < len) {
			var state = S_START;
			var secondState = null;
			var nextState = null;
			var tokenLength = 0;
			var latestAccepting = null;
			var sinceAccepts = -1;

			while (cursor < len && (nextState = state.next(lowerStr[cursor]))) {
				secondState = null;
				state = nextState;

				// Keep track of the latest accepting state
				if (state.accepts()) {
					sinceAccepts = 0;
					latestAccepting = state;
				} else if (sinceAccepts >= 0) {
					sinceAccepts++;
				}

				tokenLength++;
				cursor++;
			}

			if (sinceAccepts < 0) {
				continue;
			} // Should never happen

			// Roll back to the latest accepting state
			cursor -= sinceAccepts;
			tokenLength -= sinceAccepts;

			// Get the class for the new token
			var TOKEN = latestAccepting.emit(); // Current token class

			// No more jumps, just make a new token
			tokens.push(new TOKEN(str.substr(cursor - tokenLength, tokenLength)));
		}

		return tokens;
	};

	var start = S_START;

	var scanner = Object.freeze({
		State: CharacterState,
		TOKENS: text,
		run: run,
		start: start
	});

	/******************************************************************************
 	Multi-Tokens
 	Tokens composed of arrays of TextTokens
 ******************************************************************************/

	// Is the given token a valid domain token?
	// Should nums be included here?
	function isDomainToken(token) {
		return token instanceof DOMAIN || token instanceof TLD;
	}

	/**
 	Abstract class used for manufacturing tokens of text tokens. That is rather
 	than the value for a token being a small string of text, it's value an array
 	of text tokens.
 
 	Used for grouping together URLs, emails, hashtags, and other potential
 	creations.
 
 	@class MultiToken
 	@abstract
 */
	var MultiToken = createTokenClass();

	MultiToken.prototype = {
		/**
  	String representing the type for this token
  	@property type
  	@default 'TOKEN'
  */
		type: 'token',

		/**
  	Is this multitoken a link?
  	@property isLink
  	@default false
  */
		isLink: false,

		/**
  	Return the string this token represents.
  	@method toString
  	@return {String}
  */
		toString: function toString() {
			var result = [];
			for (var _i2 = 0; _i2 < this.v.length; _i2++) {
				result.push(this.v[_i2].toString());
			}
			return result.join('');
		},


		/**
  	What should the value for this token be in the `href` HTML attribute?
  	Returns the `.toString` value by default.
  		@method toHref
  	@return {String}
  */
		toHref: function toHref() {
			return this.toString();
		},


		/**
  	Returns a hash of relevant values for this token, which includes keys
  	* type - Kind of token ('url', 'email', etc.)
  	* value - Original text
  	* href - The value that should be added to the anchor tag's href
  		attribute
  		@method toObject
  	@param {String} [protocol] `'http'` by default
  	@return {Object}
  */
		toObject: function toObject() {
			var protocol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'http';

			return {
				type: this.type,
				value: this.toString(),
				href: this.toHref(protocol)
			};
		}
	};

	/**
 	Represents an arbitrarily mailto email address with the prefix included
 	@class MAILTO
 	@extends MultiToken
 */
	var MAILTOEMAIL = inherits(MultiToken, createTokenClass(), {
		type: 'email',
		isLink: true
	});

	/**
 	Represents a list of tokens making up a valid email address
 	@class EMAIL
 	@extends MultiToken
 */
	var EMAIL = inherits(MultiToken, createTokenClass(), {
		type: 'email',
		isLink: true,
		toHref: function toHref() {
			var tokens = this.v;
			return 'mailto:' + this.toString();
		}
	});

	/**
 	Represents some plain text
 	@class TEXT
 	@extends MultiToken
 */
	var TEXT = inherits(MultiToken, createTokenClass(), { type: 'text' });

	/**
 	Multi-linebreak token - represents a line break
 	@class NL
 	@extends MultiToken
 */
	var NL$1 = inherits(MultiToken, createTokenClass(), { type: 'nl' });

	/**
 	Represents a list of tokens making up a valid URL
 	@class URL
 	@extends MultiToken
 */
	var URL = inherits(MultiToken, createTokenClass(), {
		type: 'url',
		isLink: true,

		/**
  	Lowercases relevant parts of the domain and adds the protocol if
  	required. Note that this will not escape unsafe HTML characters in the
  	URL.
  		@method href
  	@param {String} protocol
  	@return {String}
  */
		toHref: function toHref() {
			var protocol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'http';

			var hasProtocol = false;
			var hasSlashSlash = false;
			var tokens = this.v;
			var result = [];
			var i = 0;

			// Make the first part of the domain lowercase
			// Lowercase protocol
			while (tokens[i] instanceof PROTOCOL) {
				hasProtocol = true;
				result.push(tokens[i].toString().toLowerCase());
				i++;
			}

			// Skip slash-slash
			while (tokens[i] instanceof SLASH) {
				hasSlashSlash = true;
				result.push(tokens[i].toString());
				i++;
			}

			// Lowercase all other characters in the domain
			while (isDomainToken(tokens[i])) {
				result.push(tokens[i].toString().toLowerCase());
				i++;
			}

			// Leave all other characters as they were written
			for (; i < tokens.length; i++) {
				result.push(tokens[i].toString());
			}

			result = result.join('');

			if (!(hasProtocol || hasSlashSlash)) {
				result = protocol + '://' + result;
			}

			return result;
		},
		hasProtocol: function hasProtocol() {
			return this.v[0] instanceof PROTOCOL;
		}
	});

	var multi = Object.freeze({
		Base: MultiToken,
		MAILTOEMAIL: MAILTOEMAIL,
		EMAIL: EMAIL,
		NL: NL$1,
		TEXT: TEXT,
		URL: URL
	});

	/**
 	Not exactly parser, more like the second-stage scanner (although we can
 	theoretically hotswap the code here with a real parser in the future... but
 	for a little URL-finding utility abstract syntax trees may be a little
 	overkill).
 
 	URL format: http://en.wikipedia.org/wiki/URI_scheme
 	Email format: http://en.wikipedia.org/wiki/Email_address (links to RFC in
 	reference)
 
 	@module linkify
 	@submodule parser
 	@main parser
 */

	var makeState$1 = function makeState$1(tokenClass) {
		return new TokenState(tokenClass);
	};

	// The universal starting state.
	var S_START$1 = makeState$1();

	// Intermediate states for URLs. Note that domains that begin with a protocol
	// are treated slighly differently from those that don't.
	var S_PROTOCOL = makeState$1(); // e.g., 'http:'
	var S_MAILTO$1 = makeState$1(); // 'mailto:'
	var S_PROTOCOL_SLASH = makeState$1(); // e.g., '/', 'http:/''
	var S_PROTOCOL_SLASH_SLASH = makeState$1(); // e.g., '//', 'http://'
	var S_DOMAIN$1 = makeState$1(); // parsed string ends with a potential domain name (A)
	var S_DOMAIN_DOT = makeState$1(); // (A) domain followed by DOT
	var S_TLD = makeState$1(URL); // (A) Simplest possible URL with no query string
	var S_TLD_COLON = makeState$1(); // (A) URL followed by colon (potential port number here)
	var S_TLD_PORT = makeState$1(URL); // TLD followed by a port number
	var S_URL = makeState$1(URL); // Long URL with optional port and maybe query string
	var S_URL_NON_ACCEPTING = makeState$1(); // URL followed by some symbols (will not be part of the final URL)
	var S_URL_OPENBRACE = makeState$1(); // URL followed by {
	var S_URL_OPENBRACKET = makeState$1(); // URL followed by [
	var S_URL_OPENANGLEBRACKET = makeState$1(); // URL followed by <
	var S_URL_OPENPAREN = makeState$1(); // URL followed by (
	var S_URL_OPENBRACE_Q = makeState$1(URL); // URL followed by { and some symbols that the URL can end it
	var S_URL_OPENBRACKET_Q = makeState$1(URL); // URL followed by [ and some symbols that the URL can end it
	var S_URL_OPENANGLEBRACKET_Q = makeState$1(URL); // URL followed by < and some symbols that the URL can end it
	var S_URL_OPENPAREN_Q = makeState$1(URL); // URL followed by ( and some symbols that the URL can end it
	var S_URL_OPENBRACE_SYMS = makeState$1(); // S_URL_OPENBRACE_Q followed by some symbols it cannot end it
	var S_URL_OPENBRACKET_SYMS = makeState$1(); // S_URL_OPENBRACKET_Q followed by some symbols it cannot end it
	var S_URL_OPENANGLEBRACKET_SYMS = makeState$1(); // S_URL_OPENANGLEBRACKET_Q followed by some symbols it cannot end it
	var S_URL_OPENPAREN_SYMS = makeState$1(); // S_URL_OPENPAREN_Q followed by some symbols it cannot end it
	var S_EMAIL_DOMAIN = makeState$1(); // parsed string starts with local email info + @ with a potential domain name (C)
	var S_EMAIL_DOMAIN_DOT = makeState$1(); // (C) domain followed by DOT
	var S_EMAIL = makeState$1(EMAIL); // (C) Possible email address (could have more tlds)
	var S_EMAIL_COLON = makeState$1(); // (C) URL followed by colon (potential port number here)
	var S_EMAIL_PORT = makeState$1(EMAIL); // (C) Email address with a port
	var S_MAILTO_EMAIL = makeState$1(MAILTOEMAIL); // Email that begins with the mailto prefix (D)
	var S_MAILTO_EMAIL_NON_ACCEPTING = makeState$1(); // (D) Followed by some non-query string chars
	var S_LOCALPART = makeState$1(); // Local part of the email address
	var S_LOCALPART_AT = makeState$1(); // Local part of the email address plus @
	var S_LOCALPART_DOT = makeState$1(); // Local part of the email address plus '.' (localpart cannot end in .)
	var S_NL = makeState$1(NL$1); // single new line

	// Make path from start to protocol (with '//')
	S_START$1.on(NL, S_NL).on(PROTOCOL, S_PROTOCOL).on(MAILTO, S_MAILTO$1).on(SLASH, S_PROTOCOL_SLASH);

	S_PROTOCOL.on(SLASH, S_PROTOCOL_SLASH);
	S_PROTOCOL_SLASH.on(SLASH, S_PROTOCOL_SLASH_SLASH);

	// The very first potential domain name
	S_START$1.on(TLD, S_DOMAIN$1).on(DOMAIN, S_DOMAIN$1).on(LOCALHOST, S_TLD).on(NUM, S_DOMAIN$1);

	// Force URL for protocol followed by anything sane
	S_PROTOCOL_SLASH_SLASH.on(TLD, S_URL).on(DOMAIN, S_URL).on(NUM, S_URL).on(LOCALHOST, S_URL);

	// Account for dots and hyphens
	// hyphens are usually parts of domain names
	S_DOMAIN$1.on(DOT, S_DOMAIN_DOT);
	S_EMAIL_DOMAIN.on(DOT, S_EMAIL_DOMAIN_DOT);

	// Hyphen can jump back to a domain name

	// After the first domain and a dot, we can find either a URL or another domain
	S_DOMAIN_DOT.on(TLD, S_TLD).on(DOMAIN, S_DOMAIN$1).on(NUM, S_DOMAIN$1).on(LOCALHOST, S_DOMAIN$1);

	S_EMAIL_DOMAIN_DOT.on(TLD, S_EMAIL).on(DOMAIN, S_EMAIL_DOMAIN).on(NUM, S_EMAIL_DOMAIN).on(LOCALHOST, S_EMAIL_DOMAIN);

	// S_TLD accepts! But the URL could be longer, try to find a match greedily
	// The `run` function should be able to "rollback" to the accepting state
	S_TLD.on(DOT, S_DOMAIN_DOT);
	S_EMAIL.on(DOT, S_EMAIL_DOMAIN_DOT);

	// Become real URLs after `SLASH` or `COLON NUM SLASH`
	// Here PSS and non-PSS converge
	S_TLD.on(COLON, S_TLD_COLON).on(SLASH, S_URL);
	S_TLD_COLON.on(NUM, S_TLD_PORT);
	S_TLD_PORT.on(SLASH, S_URL);
	S_EMAIL.on(COLON, S_EMAIL_COLON);
	S_EMAIL_COLON.on(NUM, S_EMAIL_PORT);

	// Types of characters the URL can definitely end in
	var qsAccepting = [DOMAIN, AT, LOCALHOST, NUM, PLUS, POUND, PROTOCOL, SLASH, TLD, UNDERSCORE, SYM, AMPERSAND];

	// Types of tokens that can follow a URL and be part of the query string
	// but cannot be the very last characters
	// Characters that cannot appear in the URL at all should be excluded
	var qsNonAccepting = [COLON, DOT, QUERY, PUNCTUATION, CLOSEBRACE, CLOSEBRACKET, CLOSEANGLEBRACKET, CLOSEPAREN, OPENBRACE, OPENBRACKET, OPENANGLEBRACKET, OPENPAREN];

	// These states are responsible primarily for determining whether or not to
	// include the final round bracket.

	// URL, followed by an opening bracket
	S_URL.on(OPENBRACE, S_URL_OPENBRACE).on(OPENBRACKET, S_URL_OPENBRACKET).on(OPENANGLEBRACKET, S_URL_OPENANGLEBRACKET).on(OPENPAREN, S_URL_OPENPAREN);

	// URL with extra symbols at the end, followed by an opening bracket
	S_URL_NON_ACCEPTING.on(OPENBRACE, S_URL_OPENBRACE).on(OPENBRACKET, S_URL_OPENBRACKET).on(OPENANGLEBRACKET, S_URL_OPENANGLEBRACKET).on(OPENPAREN, S_URL_OPENPAREN);

	// Closing bracket component. This character WILL be included in the URL
	S_URL_OPENBRACE.on(CLOSEBRACE, S_URL);
	S_URL_OPENBRACKET.on(CLOSEBRACKET, S_URL);
	S_URL_OPENANGLEBRACKET.on(CLOSEANGLEBRACKET, S_URL);
	S_URL_OPENPAREN.on(CLOSEPAREN, S_URL);
	S_URL_OPENBRACE_Q.on(CLOSEBRACE, S_URL);
	S_URL_OPENBRACKET_Q.on(CLOSEBRACKET, S_URL);
	S_URL_OPENANGLEBRACKET_Q.on(CLOSEANGLEBRACKET, S_URL);
	S_URL_OPENPAREN_Q.on(CLOSEPAREN, S_URL);
	S_URL_OPENBRACE_SYMS.on(CLOSEBRACE, S_URL);
	S_URL_OPENBRACKET_SYMS.on(CLOSEBRACKET, S_URL);
	S_URL_OPENANGLEBRACKET_SYMS.on(CLOSEANGLEBRACKET, S_URL);
	S_URL_OPENPAREN_SYMS.on(CLOSEPAREN, S_URL);

	// URL that beings with an opening bracket, followed by a symbols.
	// Note that the final state can still be `S_URL_OPENBRACE_Q` (if the URL only
	// has a single opening bracket for some reason).
	S_URL_OPENBRACE.on(qsAccepting, S_URL_OPENBRACE_Q);
	S_URL_OPENBRACKET.on(qsAccepting, S_URL_OPENBRACKET_Q);
	S_URL_OPENANGLEBRACKET.on(qsAccepting, S_URL_OPENANGLEBRACKET_Q);
	S_URL_OPENPAREN.on(qsAccepting, S_URL_OPENPAREN_Q);
	S_URL_OPENBRACE.on(qsNonAccepting, S_URL_OPENBRACE_SYMS);
	S_URL_OPENBRACKET.on(qsNonAccepting, S_URL_OPENBRACKET_SYMS);
	S_URL_OPENANGLEBRACKET.on(qsNonAccepting, S_URL_OPENANGLEBRACKET_SYMS);
	S_URL_OPENPAREN.on(qsNonAccepting, S_URL_OPENPAREN_SYMS);

	// URL that begins with an opening bracket, followed by some symbols
	S_URL_OPENBRACE_Q.on(qsAccepting, S_URL_OPENBRACE_Q);
	S_URL_OPENBRACKET_Q.on(qsAccepting, S_URL_OPENBRACKET_Q);
	S_URL_OPENANGLEBRACKET_Q.on(qsAccepting, S_URL_OPENANGLEBRACKET_Q);
	S_URL_OPENPAREN_Q.on(qsAccepting, S_URL_OPENPAREN_Q);
	S_URL_OPENBRACE_Q.on(qsNonAccepting, S_URL_OPENBRACE_Q);
	S_URL_OPENBRACKET_Q.on(qsNonAccepting, S_URL_OPENBRACKET_Q);
	S_URL_OPENANGLEBRACKET_Q.on(qsNonAccepting, S_URL_OPENANGLEBRACKET_Q);
	S_URL_OPENPAREN_Q.on(qsNonAccepting, S_URL_OPENPAREN_Q);

	S_URL_OPENBRACE_SYMS.on(qsAccepting, S_URL_OPENBRACE_Q);
	S_URL_OPENBRACKET_SYMS.on(qsAccepting, S_URL_OPENBRACKET_Q);
	S_URL_OPENANGLEBRACKET_SYMS.on(qsAccepting, S_URL_OPENANGLEBRACKET_Q);
	S_URL_OPENPAREN_SYMS.on(qsAccepting, S_URL_OPENPAREN_Q);
	S_URL_OPENBRACE_SYMS.on(qsNonAccepting, S_URL_OPENBRACE_SYMS);
	S_URL_OPENBRACKET_SYMS.on(qsNonAccepting, S_URL_OPENBRACKET_SYMS);
	S_URL_OPENANGLEBRACKET_SYMS.on(qsNonAccepting, S_URL_OPENANGLEBRACKET_SYMS);
	S_URL_OPENPAREN_SYMS.on(qsNonAccepting, S_URL_OPENPAREN_SYMS);

	// Account for the query string
	S_URL.on(qsAccepting, S_URL);
	S_URL_NON_ACCEPTING.on(qsAccepting, S_URL);

	S_URL.on(qsNonAccepting, S_URL_NON_ACCEPTING);
	S_URL_NON_ACCEPTING.on(qsNonAccepting, S_URL_NON_ACCEPTING);

	// Email address-specific state definitions
	// Note: We are not allowing '/' in email addresses since this would interfere
	// with real URLs

	// For addresses with the mailto prefix
	// 'mailto:' followed by anything sane is a valid email
	S_MAILTO$1.on(TLD, S_MAILTO_EMAIL).on(DOMAIN, S_MAILTO_EMAIL).on(NUM, S_MAILTO_EMAIL).on(LOCALHOST, S_MAILTO_EMAIL);

	// Greedily get more potential valid email values
	S_MAILTO_EMAIL.on(qsAccepting, S_MAILTO_EMAIL).on(qsNonAccepting, S_MAILTO_EMAIL_NON_ACCEPTING);
	S_MAILTO_EMAIL_NON_ACCEPTING.on(qsAccepting, S_MAILTO_EMAIL).on(qsNonAccepting, S_MAILTO_EMAIL_NON_ACCEPTING);

	// For addresses without the mailto prefix
	// Tokens allowed in the localpart of the email
	var localpartAccepting = [DOMAIN, NUM, PLUS, POUND, QUERY, UNDERSCORE, SYM, AMPERSAND, TLD];

	// Some of the tokens in `localpartAccepting` are already accounted for here and
	// will not be overwritten (don't worry)
	S_DOMAIN$1.on(localpartAccepting, S_LOCALPART).on(AT, S_LOCALPART_AT);
	S_TLD.on(localpartAccepting, S_LOCALPART).on(AT, S_LOCALPART_AT);
	S_DOMAIN_DOT.on(localpartAccepting, S_LOCALPART);

	// Okay we're on a localpart. Now what?
	// TODO: IP addresses and what if the email starts with numbers?
	S_LOCALPART.on(localpartAccepting, S_LOCALPART).on(AT, S_LOCALPART_AT) // close to an email address now
	.on(DOT, S_LOCALPART_DOT);
	S_LOCALPART_DOT.on(localpartAccepting, S_LOCALPART);
	S_LOCALPART_AT.on(TLD, S_EMAIL_DOMAIN).on(DOMAIN, S_EMAIL_DOMAIN).on(LOCALHOST, S_EMAIL);
	// States following `@` defined above

	var run$1 = function run$1(tokens) {
		var len = tokens.length;
		var cursor = 0;
		var multis = [];
		var textTokens = [];

		while (cursor < len) {
			var state = S_START$1;
			var secondState = null;
			var nextState = null;
			var multiLength = 0;
			var latestAccepting = null;
			var sinceAccepts = -1;

			while (cursor < len && !(secondState = state.next(tokens[cursor]))) {
				// Starting tokens with nowhere to jump to.
				// Consider these to be just plain text
				textTokens.push(tokens[cursor++]);
			}

			while (cursor < len && (nextState = secondState || state.next(tokens[cursor]))) {

				// Get the next state
				secondState = null;
				state = nextState;

				// Keep track of the latest accepting state
				if (state.accepts()) {
					sinceAccepts = 0;
					latestAccepting = state;
				} else if (sinceAccepts >= 0) {
					sinceAccepts++;
				}

				cursor++;
				multiLength++;
			}

			if (sinceAccepts < 0) {

				// No accepting state was found, part of a regular text token
				// Add all the tokens we looked at to the text tokens array
				for (var _i3 = cursor - multiLength; _i3 < cursor; _i3++) {
					textTokens.push(tokens[_i3]);
				}
			} else {

				// Accepting state!

				// First close off the textTokens (if available)
				if (textTokens.length > 0) {
					multis.push(new TEXT(textTokens));
					textTokens = [];
				}

				// Roll back to the latest accepting state
				cursor -= sinceAccepts;
				multiLength -= sinceAccepts;

				// Create a new multitoken
				var MULTI = latestAccepting.emit();
				multis.push(new MULTI(tokens.slice(cursor - multiLength, cursor)));
			}
		}

		// Finally close off the textTokens (if available)
		if (textTokens.length > 0) {
			multis.push(new TEXT(textTokens));
		}

		return multis;
	};

	var parser = Object.freeze({
		State: TokenState,
		TOKENS: multi,
		run: run$1,
		start: S_START$1
	});

	if (!Array.isArray) {
		Array.isArray = function (arg) {
			return Object.prototype.toString.call(arg) === '[object Array]';
		};
	}

	/**
 	Converts a string into tokens that represent linkable and non-linkable bits
 	@method tokenize
 	@param {String} str
 	@return {Array} tokens
 */
	var tokenize = function tokenize(str) {
		return run$1(run(str));
	};

	/**
 	Returns a list of linkable items in the given string.
 */
	var find = function find(str) {
		var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

		var tokens = tokenize(str);
		var filtered = [];

		for (var i = 0; i < tokens.length; i++) {
			var token = tokens[i];
			if (token.isLink && (!type || token.type === type)) {
				filtered.push(token.toObject());
			}
		}

		return filtered;
	};

	/**
 	Is the given string valid linkable text of some sort
 	Note that this does not trim the text for you.
 
 	Optionally pass in a second `type` param, which is the type of link to test
 	for.
 
 	For example,
 
 		test(str, 'email');
 
 	Will return `true` if str is a valid email.
 */
	var test = function test(str) {
		var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

		var tokens = tokenize(str);
		return tokens.length === 1 && tokens[0].isLink && (!type || tokens[0].type === type);
	};

	exports.find = find;
	exports.inherits = inherits;
	exports.options = options;
	exports.parser = parser;
	exports.scanner = scanner;
	exports.test = test;
	exports.tokenize = tokenize;
})(self.linkify = self.linkify || {});
})();;'use strict';

;(function (window, linkify) {
	var linkifyString = function (linkify) {
		'use strict';

		/**
  	Convert strings of text into linkable HTML text
  */

		var tokenize = linkify.tokenize,
		    options = linkify.options;
		var Options = options.Options;


		function escapeText(text) {
			return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		}

		function escapeAttr(href) {
			return href.replace(/"/g, '&quot;');
		}

		function attributesToString(attributes) {
			if (!attributes) {
				return '';
			}
			var result = [];

			for (var attr in attributes) {
				var val = attributes[attr] + '';
				result.push(attr + '="' + escapeAttr(val) + '"');
			}
			return result.join(' ');
		}

		function linkifyStr(str) {
			var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			opts = new Options(opts);

			var tokens = tokenize(str);
			var result = [];

			for (var i = 0; i < tokens.length; i++) {
				var token = tokens[i];

				if (token.type === 'nl' && opts.nl2br) {
					result.push('<br>\n');
					continue;
				} else if (!token.isLink || !opts.check(token)) {
					result.push(escapeText(token.toString()));
					continue;
				}

				var _opts$resolve = opts.resolve(token),
				    formatted = _opts$resolve.formatted,
				    formattedHref = _opts$resolve.formattedHref,
				    tagName = _opts$resolve.tagName,
				    className = _opts$resolve.className,
				    target = _opts$resolve.target,
				    attributes = _opts$resolve.attributes;

				var link = '<' + tagName + ' href="' + escapeAttr(formattedHref) + '"';

				if (className) {
					link += ' class="' + escapeAttr(className) + '"';
				}

				if (target) {
					link += ' target="' + escapeAttr(target) + '"';
				}

				if (attributes) {
					link += ' ' + attributesToString(attributes);
				}

				link += '>' + escapeText(formatted) + '</' + tagName + '>';
				result.push(link);
			}

			return result.join('');
		}

		if (!String.prototype.linkify) {
			String.prototype.linkify = function (opts) {
				return linkifyStr(this, opts);
			};
		}

		return linkifyStr;
	}(linkify);

	window.linkifyStr = linkifyString;
})(window, linkify); ;/*
    http://www.JSON.org/json2.js
    2010-11-17

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false, regexp: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (!this.JSON) {
    this.JSON = {};
}

(function () {
    "use strict";

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
.replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());
;// Generated by CoffeeScript 1.7.1
var $, Util, gettext, _gettext, _ref, _t;

gettext = null;

if (typeof Gettext !== "undefined" && Gettext !== null) {
  _gettext = new Gettext({
    domain: "annotator"
  });
  gettext = function(msgid) {
    return _gettext.gettext(msgid);
  };
} else {
  gettext = function(msgid) {
    return msgid;
  };
}

_t = function(msgid) {
  return gettext(msgid);
};

if (!(typeof jQuery !== "undefined" && jQuery !== null ? (_ref = jQuery.fn) != null ? _ref.jquery : void 0 : void 0)) {
  console.error(_t("Annotator requires jQuery: have you included lib/vendor/jquery.js?"));
}

if (!(JSON && JSON.parse && JSON.stringify)) {
  console.error(_t("Annotator requires a JSON implementation: have you included lib/vendor/json2.js?"));
}

$ = jQuery;

Util = {};

Util.flatten = function(array) {
  var flatten;
  flatten = function(ary) {
    var el, flat, _i, _len;
    flat = [];
    for (_i = 0, _len = ary.length; _i < _len; _i++) {
      el = ary[_i];
      flat = flat.concat(el && $.isArray(el) ? flatten(el) : el);
    }
    return flat;
  };
  return flatten(array);
};

Util.contains = function(parent, child) {
  var node;
  node = child;
  while (node != null) {
    if (node === parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
};

Util.getTextNodes = function(jq) {
  var getTextNodes;
  getTextNodes = function(node) {
    var nodes;
    if (node && node.nodeType !== Node.TEXT_NODE) {
      nodes = [];
      if (node.nodeType !== Node.COMMENT_NODE) {
        node = node.lastChild;
        while (node) {
          nodes.push(getTextNodes(node));
          node = node.previousSibling;
        }
      }
      return nodes.reverse();
    } else {
      return node;
    }
  };
  return jq.map(function() {
    return Util.flatten(getTextNodes(this));
  });
};

Util.getLastTextNodeUpTo = function(n) {
  var result;
  if(n){
    switch (n.nodeType) {
    case Node.TEXT_NODE:
      return n;
    case Node.ELEMENT_NODE:
      if (n.lastChild != null) {
        result = Util.getLastTextNodeUpTo(n.lastChild);
        if (result != null) {
          return result;
        }
      }
      break;
    }
    n = n.previousSibling;
    if (n != null) {
      return Util.getLastTextNodeUpTo(n);
    } else {
      return null;
    }
  }
};

Util.getFirstTextNodeNotBefore = function(n) {
  var result;
  if(n){
    switch (n.nodeType) {
    case Node.TEXT_NODE:
      return n;
    case Node.ELEMENT_NODE:
      if (n.firstChild != null) {
        result = Util.getFirstTextNodeNotBefore(n.firstChild);
        if (result != null) {
          return result;
        }
      }
      break;
    }
    n = n.nextSibling;
    if (n != null) {
      return Util.getFirstTextNodeNotBefore(n);
    } else {
      return null;
    }
  } 
};

Util.readRangeViaSelection = function(range) {
  var sel;
  sel = Util.getGlobal().getSelection();
  sel.removeAllRanges();
  sel.addRange(range.toRange());
  return sel.toString();
};

Util.xpathFromNode = function(el, relativeRoot) {
  var exception, result;
  try {
    result = simpleXPathJQuery.call(el, relativeRoot);
  } catch (_error) {
    exception = _error;
    console.log("jQuery-based XPath construction failed! Falling back to manual.");
    result = simpleXPathPure.call(el, relativeRoot);
  }
  return result;
};

Util.nodeFromXPath = function(xp, root) {
  var idx, name, node, step, steps, _i, _len, _ref1;
  steps = xp.substring(1).split("/");
  node = root;
  for (_i = 0, _len = steps.length; _i < _len; _i++) {
    step = steps[_i];
    _ref1 = step.split("["), name = _ref1[0], idx = _ref1[1];
    idx = idx != null ? parseInt((idx != null ? idx.split("]") : void 0)[0]) : 1;
    node = findChild(node, name.toLowerCase(), idx);
  }
  return node;
};

Util.escape = function(html) {
  return html.replace(/&(?!\w+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

Util.uuid = (function() {
  var counter;
  counter = 0;
  return function() {
    return counter++;
  };
})();

Util.getGlobal = function() {
  return (function() {
    return this;
  })();
};

Util.maxZIndex = function($elements) {
  var all, el;
  all = (function() {
    var _i, _len, _results;
    _results = [];
    for (_i = 0, _len = $elements.length; _i < _len; _i++) {
      el = $elements[_i];
      if ($(el).css('position') === 'static') {
        _results.push(-1);
      } else {
        _results.push(parseFloat($(el).css('z-index')) || -1);
      }
    }
    return _results;
  })();
  return Math.max.apply(Math, all);
};

Util.mousePosition = function(e, offsetEl) {
  var offset, _ref1;
  if ((_ref1 = $(offsetEl).css('position')) !== 'absolute' && _ref1 !== 'fixed' && _ref1 !== 'relative') {
    offsetEl = $(offsetEl).offsetParent()[0];
  }
  offset = $(offsetEl).offset();
  return {
    top: e.pageY - offset.top,
    left: e.pageX - offset.left
  };
};

Util.preventEventDefault = function(event) {
  return event != null ? typeof event.preventDefault === "function" ? event.preventDefault() : void 0 : void 0;
};

//# sourceMappingURL=util.map
;// Generated by CoffeeScript 1.7.1
var fn, functions, _i, _j, _len, _len1,
  __slice = [].slice;

functions = ["log", "debug", "info", "warn", "exception", "assert", "dir", "dirxml", "trace", "group", "groupEnd", "groupCollapsed", "time", "timeEnd", "profile", "profileEnd", "count", "clear", "table", "error", "notifyFirebug", "firebug", "userObjects"];

if (typeof console !== "undefined" && console !== null) {
  if (console.group == null) {
    console.group = function(name) {
      return console.log("GROUP: ", name);
    };
  }
  if (console.groupCollapsed == null) {
    console.groupCollapsed = console.group;
  }
  for (_i = 0, _len = functions.length; _i < _len; _i++) {
    fn = functions[_i];
    if (console[fn] == null) {
      console[fn] = function() {
        return console.log(_t("Not implemented:") + (" console." + name));
      };
    }
  }
} else {
  this.console = {};
  for (_j = 0, _len1 = functions.length; _j < _len1; _j++) {
    fn = functions[_j];
    this.console[fn] = function() {};
  }
  this.console['error'] = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return alert("ERROR: " + (args.join(', ')));
  };
  this.console['warn'] = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return alert("WARNING: " + (args.join(', ')));
  };
}

//# sourceMappingURL=console.map
;// Generated by CoffeeScript 1.7.1
var Delegator,
  __slice = [].slice,
  __hasProp = {}.hasOwnProperty;

Delegator = (function() {
  Delegator.prototype.events = {};

  Delegator.prototype.options = {};

  Delegator.prototype.element = null;

  function Delegator(element, options) {
    this.options = $.extend(true, {}, this.options, options);
    this.element = $(element);
    this._closures = {};
    this.on = this.subscribe;
    this.addEvents();
  }

  Delegator.prototype.destroy = function() {
    return this.removeEvents();
  };

  Delegator.prototype.addEvents = function() {
    var event, _i, _len, _ref, _results;
    _ref = Delegator._parseEvents(this.events);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      event = _ref[_i];
      _results.push(this._addEvent(event.selector, event.event, event.functionName));
    }
    return _results;
  };

  Delegator.prototype.removeEvents = function() {
    var event, _i, _len, _ref, _results;
    _ref = Delegator._parseEvents(this.events);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      event = _ref[_i];
      _results.push(this._removeEvent(event.selector, event.event, event.functionName));
    }
    return _results;
  };

  Delegator.prototype._addEvent = function(selector, event, functionName) {
    var closure;
    closure = (function(_this) {
      return function() {
        return _this[functionName].apply(_this, arguments);
      };
    })(this);
    if (selector === '' && Delegator._isCustomEvent(event)) {
      this.subscribe(event, closure);
    } else {
      this.element.delegate(selector, event, closure);
    }
    this._closures["" + selector + "/" + event + "/" + functionName] = closure;
    return this;
  };

  Delegator.prototype._removeEvent = function(selector, event, functionName) {
    var closure;
    closure = this._closures["" + selector + "/" + event + "/" + functionName];
    if (selector === '' && Delegator._isCustomEvent(event)) {
      this.unsubscribe(event, closure);
    } else {
      this.element.undelegate(selector, event, closure);
    }
    delete this._closures["" + selector + "/" + event + "/" + functionName];
    return this;
  };

  Delegator.prototype.publish = function() {
    this.element.triggerHandler.apply(this.element, arguments);
    return this;
  };

  Delegator.prototype.subscribe = function(event, callback) {
    var closure;
    closure = function() {
      return callback.apply(this, [].slice.call(arguments, 1));
    };
    closure.guid = callback.guid = ($.guid += 1);
    this.element.bind(event, closure);
    return this;
  };

  Delegator.prototype.unsubscribe = function() {
    this.element.unbind.apply(this.element, arguments);
    return this;
  };

  return Delegator;

})();

Delegator._parseEvents = function(eventsObj) {
  var event, events, functionName, sel, selector, _i, _ref;
  events = [];
  for (sel in eventsObj) {
    functionName = eventsObj[sel];
    _ref = sel.split(' '), selector = 2 <= _ref.length ? __slice.call(_ref, 0, _i = _ref.length - 1) : (_i = 0, []), event = _ref[_i++];
    events.push({
      selector: selector.join(' '),
      event: event,
      functionName: functionName
    });
  }
  return events;
};

Delegator.natives = (function() {
  var key, specials, val;
  specials = (function() {
    var _ref, _results;
    _ref = jQuery.event.special;
    _results = [];
    for (key in _ref) {
      if (!__hasProp.call(_ref, key)) continue;
      val = _ref[key];
      _results.push(key);
    }
    return _results;
  })();
  return "blur focus focusin focusout load resize scroll unload click dblclick\nmousedown mouseup mousemove mouseover mouseout mouseenter mouseleave\nchange select submit keydown keypress keyup error".split(/[^a-z]+/).concat(specials);
})();

Delegator._isCustomEvent = function(event) {
  event = event.split('.')[0];
  return $.inArray(event, Delegator.natives) === -1;
};

//# sourceMappingURL=class.map
;// Generated by CoffeeScript 1.7.1
var Range,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Range = {};

Range.sniff = function(r) {
  if (r.commonAncestorContainer != null) {
    return new Range.BrowserRange(r);
  } else if (typeof r.start === "string") {
    return new Range.SerializedRange(r);
  } else if (r.start && typeof r.start === "object") {
    return new Range.NormalizedRange(r);
  } else {
    console.error(_t("Could not sniff range type"));
    return false;
  }
};

Range.nodeFromXPath = function(xpath, root) {
  var customResolver, evaluateXPath, namespace, node, segment;
  if (root == null) {
    root = document;
  }
  evaluateXPath = function(xp, nsResolver) {
    var exception;
    if (nsResolver == null) {
      nsResolver = null;
    }
    try {
      var evalNode = document.evaluate('.' + xp, root, nsResolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if(evalNode === null )
          return Util.nodeFromXPath(xp, root);
      return evalNode;
      } catch (_error) {
        exception = _error;
        console.log("XPath evaluation failed.");
        console.log("Trying fallback...");
        return Util.nodeFromXPath(xp, root);
    }
  };
  if (!$.isXMLDoc(document.documentElement)) {
    return evaluateXPath(xpath);
  } else {
    customResolver = document.createNSResolver(document.ownerDocument === null ? document.documentElement : document.ownerDocument.documentElement);
    node = evaluateXPath(xpath, customResolver);
    if (!node) {
      xpath = ((function() {
        var _i, _len, _ref, _results;
        _ref = xpath.split('/');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          segment = _ref[_i];
          if (segment && segment.indexOf(':') === -1) {
            _results.push(segment.replace(/^([a-z]+)/, 'xhtml:$1'));
          } else {
            _results.push(segment);
          }
        }
        return _results;
      })()).join('/');
      namespace = document.lookupNamespaceURI(null);
      customResolver = function(ns) {
        if (ns === 'xhtml') {
          return namespace;
        } else {
          return document.documentElement.getAttribute('xmlns:' + ns);
        }
      };
      node = evaluateXPath(xpath, customResolver);
    }
    return node;
  }
};

Range.RangeError = (function(_super) {
  __extends(RangeError, _super);

  function RangeError(type, message, parent) {
    this.type = type;
    this.message = message;
    this.parent = parent != null ? parent : null;
    RangeError.__super__.constructor.call(this, this.message);
  }

  return RangeError;

})(Error);

Range.BrowserRange = (function() {
  function BrowserRange(obj) {
    this.commonAncestorContainer = obj.commonAncestorContainer;
    this.startContainer = obj.startContainer;
    this.startOffset = obj.startOffset;
    this.endContainer = obj.endContainer;
    this.endOffset = obj.endOffset;
  }

  BrowserRange.prototype.normalize = function(root) {
    var n, node, nr, r;
    if (this.tainted) {
      console.error(_t("You may only call normalize() once on a BrowserRange!"));
      return false;
    } else {
      this.tainted = true;
    }
    r = {};
    if (this.startContainer.nodeType === Node.ELEMENT_NODE) {
      r.start = Util.getFirstTextNodeNotBefore(this.startContainer.childNodes[this.startOffset]);
      r.startOffset = 0;
    } else {
      r.start = this.startContainer;
      r.startOffset = this.startOffset;
    }
    if (this.endContainer.nodeType === Node.ELEMENT_NODE) {
      node = this.endContainer.childNodes[this.endOffset];
      if (node != null) {
        n = node;
        while ((n != null) && (n.nodeType !== Node.TEXT_NODE)) {
          n = n.firstChild;
        }
        if (n != null) {
          r.end = n;
          r.endOffset = 0;
        }
      }
      if (r.end == null) {
        if (this.endOffset) {
          node = this.endContainer.childNodes[this.endOffset - 1];
        } else {
          node = this.endContainer.previousSibling;
        }
        r.end = Util.getLastTextNodeUpTo(node);
        r.endOffset = r.end.nodeValue.length;
      }
    } else {
      r.end = this.endContainer;
      r.endOffset = this.endOffset;
    }
    nr = {};
    if (r.startOffset > 0) {
      if (r.start.nodeValue.length > r.startOffset) {
        nr.start = r.start.splitText(r.startOffset);
      } else {
        nr.start = r.start.nextSibling;
      }
    } else {
      nr.start = r.start;
    }
    if (r.start === r.end) {
      if (nr.start.nodeValue.length > (r.endOffset - r.startOffset)) {
        nr.start.splitText(r.endOffset - r.startOffset);
      }
      nr.end = nr.start;
    } else {
      if (r.end.nodeValue.length > r.endOffset) {
        r.end.splitText(r.endOffset);
      }
      nr.end = r.end;
    }
    nr.commonAncestor = this.commonAncestorContainer;
    while (nr.commonAncestor.nodeType !== Node.ELEMENT_NODE) {
      nr.commonAncestor = nr.commonAncestor.parentNode;
    }
    return new Range.NormalizedRange(nr);
  };

  BrowserRange.prototype.serialize = function(root, ignoreSelector) {
    return this.normalize(root).serialize(root, ignoreSelector);
  };

  return BrowserRange;

})();

Range.NormalizedRange = (function() {
  function NormalizedRange(obj) {
    this.commonAncestor = obj.commonAncestor;
    this.start = obj.start;
    this.end = obj.end;
  }

  NormalizedRange.prototype.normalize = function(root) {
    return this;
  };

  NormalizedRange.prototype.limit = function(bounds) {
    var nodes, parent, startParents, _i, _len, _ref;
    nodes = $.grep(this.textNodes(), function(node) {
      return node.parentNode === bounds || $.contains(bounds, node.parentNode);
    });
    if (!nodes.length) {
      return null;
    }
    this.start = nodes[0];
    this.end = nodes[nodes.length - 1];
    startParents = $(this.start).parents();
    _ref = $(this.end).parents();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      parent = _ref[_i];
      if (startParents.index(parent) !== -1) {
        this.commonAncestor = parent;
        break;
      }
    }
    return this;
  };

  NormalizedRange.prototype.serialize = function(root, ignoreSelector) {
    var end, serialization, start;
    serialization = function(node, isEnd) {
      var n, nodes, offset, origParent, textNodes, xpath, _i, _len;
      if (ignoreSelector) {
        origParent = $(node).parents(":not(" + ignoreSelector + ")").eq(0);
      } else {
        origParent = $(node).parent();
      }
      xpath = Util.xpathFromNode(origParent, root)[0];
      textNodes = Util.getTextNodes(origParent);
      nodes = textNodes.slice(0, textNodes.index(node));
      offset = 0;
      for (_i = 0, _len = nodes.length; _i < _len; _i++) {
        n = nodes[_i];
        offset += n.nodeValue.length;
      }
      if (isEnd) {
        return [xpath, offset + node.nodeValue.length];
      } else {
        return [xpath, offset];
      }
    };
    start = serialization(this.start);
    end = serialization(this.end, true);
    return new Range.SerializedRange({
      start: start[0],
      end: end[0],
      startOffset: start[1],
      endOffset: end[1]
    });
  };

  NormalizedRange.prototype.text = function() {
    var node;
    return ((function() {
      var _i, _len, _ref, _results;
      _ref = this.textNodes();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        _results.push(node.nodeValue);
      }
      return _results;
    }).call(this)).join('');
  };

  NormalizedRange.prototype.textNodes = function() {
    var end, start, textNodes, _ref;
    textNodes = Util.getTextNodes($(this.commonAncestor));
    _ref = [textNodes.index(this.start), textNodes.index(this.end)], start = _ref[0], end = _ref[1];
    return $.makeArray(textNodes.slice(start, +end + 1 || 9e9));
  };

  NormalizedRange.prototype.toRange = function() {
    var range;
    range = document.createRange();
    range.setStartBefore(this.start);
    range.setEndAfter(this.end);
    return range;
  };

  return NormalizedRange;

})();

Range.SerializedRange = (function() {
  function SerializedRange(obj) {
    this.start = obj.start;
    this.startOffset = obj.startOffset;
    this.end = obj.end;
    this.endOffset = obj.endOffset;
  }

  SerializedRange.prototype.normalize = function(root) {
    var contains, e, length, node, p, range, targetOffset, tn, _i, _j, _len, _len1, _ref, _ref1;
    range = {};
    _ref = ['start', 'end'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      p = _ref[_i];
      try {
        node = Range.nodeFromXPath(this[p], root);
      } catch (_error) {
        e = _error;
        throw new Range.RangeError(p, ("Error while finding " + p + " node: " + this[p] + ": ") + e, e);
      }
      if (!node) {
        throw new Range.RangeError(p, "Couldn't find " + p + " node: " + this[p]);
      }
      length = 0;
      targetOffset = this[p + 'Offset'];
      if (p === 'end') {
        targetOffset--;
      }
      _ref1 = Util.getTextNodes($(node));
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        tn = _ref1[_j];
        if (length + tn.nodeValue.length > targetOffset) {
          range[p + 'Container'] = tn;
          range[p + 'Offset'] = this[p + 'Offset'] - length;
          break;
        } else {
          length += tn.nodeValue.length;
        }
      }
      if (range[p + 'Offset'] == null) {
        throw new Range.RangeError("" + p + "offset", "Couldn't find offset " + this[p + 'Offset'] + " in element " + this[p]);
      }
    }
    contains = document.compareDocumentPosition == null ? function(a, b) {
      return a.contains(b);
    } : function(a, b) {
      return a.compareDocumentPosition(b) & 16;
    };
    $(range.startContainer).parents().each(function() {
      if (contains(this, range.endContainer)) {
        range.commonAncestorContainer = this;
        return false;
      }
    });
    return new Range.BrowserRange(range).normalize(root);
  };

  SerializedRange.prototype.serialize = function(root, ignoreSelector) {
    return this.normalize(root).serialize(root, ignoreSelector);
  };

  SerializedRange.prototype.toObject = function() {
    return {
      start: this.start,
      startOffset: this.startOffset,
      end: this.end,
      endOffset: this.endOffset
    };
  };

  return SerializedRange;

})();

//# sourceMappingURL=range.map
;// Generated by CoffeeScript 1.7.1
var Annotator, g, _Annotator, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_Annotator = this.Annotator;
var language = window.annotationLocale || 'en-US';
Annotator = (function(_super) {
  __extends(Annotator, _super);

  Annotator.prototype.events = {
    ".annotator-adder click": "onAdderClick",
    ".annotator-adder mousedown": "onAdderMousedown",
    // ".annotator-hl mouseover": "onHighlightMouseover",
    ".annotator-hl click": "onHighlightClick"
    // ".annotator-hl mouseout": "startViewerHideTimer"
  };

  Annotator.prototype.html = {
    adder: '<div class="annotator-adder"><button>' + _t('Annotate') + '</button></div>',
    wrapper: '<div class="annotator-wrapper"></div>'
  };

  Annotator.prototype.options = {
    readOnly: false
  };

  Annotator.prototype.plugins = {};

  Annotator.prototype.isShareable = false;

  Annotator.prototype.editor = null;

  Annotator.prototype.viewer = null;

  Annotator.prototype.selectedRanges = null;

  Annotator.prototype.mouseIsDown = false;

  Annotator.prototype.selectedAnnArr = [];

  Annotator.prototype.ignoreMouseup = false;

  Annotator.prototype.viewerHideTimer = null;

  function Annotator(element, options) {
    this.onDeleteAnnotation = __bind(this.onDeleteAnnotation, this);
    this.onEditAnnotation = __bind(this.onEditAnnotation, this);
    this.onAdderClick = __bind(this.onAdderClick, this);
    this.onAdderMousedown = __bind(this.onAdderMousedown, this);
    this.onHighlightMouseover = __bind(this.onHighlightMouseover, this);
    this.onHighlightClick = __bind(this.onHighlightClick, this);    
    this.checkForEndSelection = __bind(this.checkForEndSelection, this);
    this.checkForStartSelection = __bind(this.checkForStartSelection, this);
    this.clearViewerHideTimer = __bind(this.clearViewerHideTimer, this);
    this.startViewerHideTimer = __bind(this.startViewerHideTimer, this);
    this.showViewer = __bind(this.showViewer, this);
    this.onEditorSubmit = __bind(this.onEditorSubmit, this);
    this.onEditorHide = __bind(this.onEditorHide, this);
    this.showEditor = __bind(this.showEditor, this);
    this.getSelectedAnnotations = __bind(this.getSelectedAnnotations, this);
    Annotator.__super__.constructor.apply(this, arguments);
    this.plugins = {};
    if (!Annotator.supported()) {
      return this;
    }
    if (!this.options.readOnly) {
      this._setupDocumentEvents();
    }
    this._setupWrapper()._setupViewer()._setupEditor();
    this._setupDynamicStyle();
    this.adder = $(this.html.adder).appendTo(this.wrapper).hide();
    Annotator._instances.push(this);
  }

  Annotator.prototype._setupWrapper = function() {
   // this.wrapper = $('<span class="annotation-wrapper"/>');
    //this.element.find('script').remove();
   this.element.addClass('annotation-wrapper');
   this.wrapper = this.element;
   return this;
  };

  Annotator.prototype._setupViewer = function() {
    this.viewer = new Annotator.Viewer({
      readOnly: this.options.readOnly
    });
    this.viewer.hide().on("edit", this.onEditAnnotation).on("delete", this.onDeleteAnnotation).addField({
      load: (function(_this) {
        return function(field, annotation) {
          if (annotation.text) {
            $(field).html(Util.escape(annotation.text));
          } else {
            $(field).html("<i>" + (_t('No Comment')) + "</i>");
          }
          return _this.publish('annotationViewerTextField', [field, annotation]);
        };
      })(this)
    }).element.appendTo(this.wrapper).bind({
      "mouseover": this.clearViewerHideTimer,
      "mouseout": this.startViewerHideTimer
    });
    return this;
  };

  Annotator.prototype._setupEditor = function() {
    this.editor = new Annotator.Editor();
    this.editor.hide().on('hide', this.onEditorHide).on('save', this.onEditorSubmit).addField({
      type: 'textarea',
      label: locale_data[language]['add_note'],
      load: function(field, annotation) {
        return $(field).find('textarea').val(annotation.text || '');
      },
      submit: function(field, annotation) {
        return annotation.text = $(field).find('textarea').val();
      }
    });
    this.editor.element.appendTo(this.wrapper);
    return this;
  };

  Annotator.prototype._setupDocumentEvents = function() {
    $(document).bind({
      "mouseup": this.checkForEndSelection,
      "mousedown": this.checkForStartSelection
    });
    return this;
  };

  Annotator.prototype._setupDynamicStyle = function() {
    var max, sel, style, x;
    style = $('#annotator-dynamic-style');
    if (!style.length) {
      style = $('<style id="annotator-dynamic-style"></style>').appendTo(document.head);
    }
    sel = '*' + ((function() {
      var _i, _len, _ref, _results;
      _ref = ['adder', 'outer', 'notice', 'filter'];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        x = _ref[_i];
        _results.push(":not(.annotator-" + x + ")");
      }
      return _results;
    })()).join('');
    max = Util.maxZIndex($(document.body).find(sel));
    max = Math.max(max, 1000);
    style.text([".annotator-adder, .annotator-outer, .annotator-notice {", "  z-index: " + (20) + ";", "}", ".annotator-filter {", "  z-index: " + (20) + ";", "}"].join("\n"));
    return this;
  };

  Annotator.prototype.destroy = function() {
    var idx, name, plugin, _base, _ref;
    Annotator.__super__.destroy.apply(this, arguments);
    $(document).unbind({
      "mouseup": this.checkForEndSelection,
      "mousedown": this.checkForStartSelection
    });
    $('#annotator-dynamic-style').remove();
    this.adder.remove();
    this.viewer.destroy();
    this.editor.destroy();
    this.wrapper.find('.annotator-hl').each(function() {
      $(this).contents().insertBefore(this);
      return $(this).remove();
    });
    this.wrapper.contents().insertBefore(this.wrapper);
    this.wrapper.remove();
    this.element.data('annotator', null);
    _ref = this.plugins;
    for (name in _ref) {
      plugin = _ref[name];
      if (typeof (_base = this.plugins[name]).destroy === "function") {
        _base.destroy();
      }
    }
    idx = Annotator._instances.indexOf(this);
    if (idx !== -1) {
      return Annotator._instances.splice(idx, 1);
    }
  };

  Annotator.prototype.getSelectedRanges = function() {
    var browserRange, i, normedRange, r, ranges, rangesToIgnore, selection, _i, _len;
    selection = Util.getGlobal().getSelection();
    ranges = [];
    rangesToIgnore = [];
    if (!selection.isCollapsed) {
      ranges = (function() {
        var _i, _ref, _results;
        _results = [];
        for (i = _i = 0, _ref = selection.rangeCount; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          r = selection.getRangeAt(i);
          browserRange = new Range.BrowserRange(r);
          normedRange = browserRange.normalize().limit(this.wrapper[0]);
          if (normedRange === null) {
            rangesToIgnore.push(r);
          }
          _results.push(normedRange);
        }
        return _results;
      }).call(this);
      selection.removeAllRanges();
    }
    for (_i = 0, _len = rangesToIgnore.length; _i < _len; _i++) {
      r = rangesToIgnore[_i];
      selection.addRange(r);
    }
    return $.grep(ranges, function(range) {
      if (range) {
        selection.addRange(range.toRange());
      }
      return range;
    });
  };

  Annotator.prototype.createAnnotation = function() {
    var annotation;
    annotation = {};
    this.publish('beforeAnnotationCreated', [annotation]);
    return annotation;
  };

  Annotator.prototype.setupAnnotation = function(annotation) {
    var e, normed, normedRanges, r, root, _i, _j, _len, _len1, _ref;
    root = this.wrapper[0];
    annotation.ranges || (annotation.ranges = this.selectedRanges);
    normedRanges = [];
    _ref = annotation.ranges;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      r = _ref[_i];
      try {
        normedRanges.push(Range.sniff(r).normalize(root));
      } catch (_error) {
        e = _error;
        if (e instanceof Range.RangeError) {
          this.publish('rangeNormalizeFail', [annotation, r, e]);
        } else {
          throw e;
        }
      }
    }
    annotation.quote = annotation.quote||[];
    annotation.ranges = [];
    annotation.highlights = [];
    for (_j = 0, _len1 = normedRanges.length; _j < _len1; _j++) {
      normed = normedRanges[_j];
      normed.color=annotation.colorCode;
      normed.note=annotation.text;
      if($(normed.commonAncestor).find(".annotator-handle").length) {
        noteIcon = $(normed.commonAncestor).find(".annotator-handle")[0].innerText;
        $(normed.commonAncestor).find(".annotator-handle")[0].innerText = "";
        if(Array.isArray(annotation.quote))annotation.quote.push($.trim(normed.text()));
        $(normed.commonAncestor).find(".annotator-handle")[0].innerText = noteIcon;
      }
      else
       if(Array.isArray(annotation.quote))annotation.quote.push($.trim(normed.text()));

      annotation.ranges.push(normed.serialize(this.wrapper[0], '.annotator-hl'));
      $.merge(annotation.highlights, this.highlightRange(normed));
    }
    if(Array.isArray(annotation.quote))annotation.quote = annotation.quote.join(' / ');
    $(annotation.highlights).data('annotation', annotation);
    $(annotation.highlights).attr('data-annotation-id', annotation.id);
    $(annotation.highlights).attr('data-ann-id', annotation.id);
    $(annotation.highlights).attr('shareable', annotation.shareable);
    annotation.createdTimestamp = new Date().toISOString();
    return annotation;
  };

  Annotator.prototype.updateAnnotation = function(annotation) {
    this.publish('beforeAnnotationUpdated', [annotation]);
    $(annotation.highlights).attr('data-annotation-id', annotation.id);
    this.publish('annotationUpdated', [annotation]);
    return annotation;
  };

  Annotator.prototype.deleteAnnotation = function(annotation) {
    var child, h, _i, _len, _ref;
    if (annotation.highlights != null) {
      $(annotation.highlights).find('.annotator-handle').each(function(i) {
        if($(this).closest('.annotator-hl').attr('shareable') != 'true') {
          $(this).remove();
        }
      });
      $('.annotator-handle').css({'margin-top' : '6px'});
      _ref = annotation.highlights;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        h = _ref[_i];
        if (!(h.parentNode != null)) {
          continue;
        }
        child = h.childNodes[0];
        $(h).replaceWith(h.childNodes);
      }
    }
    this.alignMathMlNote();
    this.alignNotes();
    this.publish('annotationDeleted', [annotation]);
    return annotation;
  };

  Annotator.prototype.shareAnnotations = function(isShareable) {
    return this.isShareable=isShareable;
  };

  Annotator.prototype.updateAnnotationId = function (annotation) {
     $('.annotator-hl').each(function() {
      if(Date.parse($(this).data("annotation").createdTimestamp) == annotation.createdTimestamp) {
        $(this).data("annotation").id=annotation.id;
        $(this).attr('data-ann-id', annotation.id);
      }
    })
  };

  Annotator.prototype.loadAnnotations = function(annotations, isUpdate) {
    var clone, loader;
    if (annotations == null) {
      annotations = [];
    }
    if(isUpdate){   
        this.editor.currentAnnotation=annotations[0];   
    }
    loader = (function(_this) {
      return function(annList) {
        var n, now, _i, _len;
        if (annList == null) {
          annList = [];
        }
        now = annList.splice(0, 10);
        for (_i = 0, _len = now.length; _i < _len; _i++) {
          n = now[_i];
          _this.setupAnnotation(n);
        }
        if (annList.length > 0) {
          return setTimeout((function() {
            return loader(annList);
          }), 10);
        } else {
          return _this.publish('annotationsLoaded', [clone]);
        }
      };
    })(this);
    clone = annotations.slice();
    loader(annotations);
    window.getSelection().removeAllRanges();
    var self = this;
    setTimeout(function(){
      self.alignNotes();
      self.alignMathMlNote();
    },1600)
    return this;
  };

  Annotator.prototype.dumpAnnotations = function() {
    if (this.plugins['Store']) {
      return this.plugins['Store'].dumpAnnotations();
    } else {
      console.warn(_t("Can't dump annotations without Store plugin."));
      return false;
    }
  };
  Annotator.prototype.alignMathMlNote =function(){
    
  };
  Annotator.prototype.alignNotes = function() {
    var notes=document.getElementsByClassName('annotator-handle');
    for (var i = 0; i<notes.length - 1; i++) {
      for(var j=i+1;j<notes.length;j++){
        var noteOne=notes[i];
        var noteTwo=notes[j];
        var noteOneBoundaries=notes[i].getBoundingClientRect();
        var noteTwoBoundaries=noteTwo.getBoundingClientRect();
        var overlapped=!(noteOneBoundaries.right < noteTwoBoundaries.left || 
                  noteOneBoundaries.left > noteTwoBoundaries.right || 
                  noteOneBoundaries.bottom < noteTwoBoundaries.top || 
                  noteOneBoundaries.top > noteTwoBoundaries.bottom);
        if(overlapped && $(noteOne).css('visibility')==='visible' && $(noteTwo).css('visibility')==='visible'){
          noteTwo.style.marginTop=parseInt($(noteTwo).css('margin-top'))+30 + 'px';
        }
      }
    }
  };
  
  Annotator.prototype.highlightRange = function(normedRange, cssClass) {
   var hl, node, white, _i, _len, _ref, _results, handle;
   if (cssClass == null) {
    cssClass = 'annotator-hl';
   }
   //if(normedRange.note && normedRange.note.length)
    cssClass+=" highlight-note";
   white = /^\s*$/;
   var annBgColor = '', noteIconBgColor = '', noteText = '';
   if(normedRange.color == '#FFD232') { //Yellow
      annBgColor = 'rgba(255,210,50,0.4)';
      noteIconBgColor = '#ffedad';
      noteText = 'Q';
   } else if (normedRange.color == '#55DF49') { //Green
      annBgColor = noteIconBgColor = '#bbf2b6';
      noteText = 'M';
   } else if (normedRange.color == '#FC92CF') { //Pink
      annBgColor = noteIconBgColor = '#fed3ec';
      noteText = 'O';
   } else if (normedRange.color == '#ccf5fd') { //Share(Blue)
      annBgColor = noteIconBgColor = '#ccf5fd';
      noteText = 'I';
   } else {
      annBgColor = noteIconBgColor = normedRange.color;
   }
   hl = $("<span class='" + cssClass + "' style=background:" + annBgColor + "></span>");
   handle=$("<span class='annotator-handle' style=background-color:" + noteIconBgColor + ">" + noteText +"</span>");
   _ref = normedRange.textNodes();
   _results = [];
   for (_i = 0, _len = _ref.length; _i < _len; _i++) {
     node = _ref[_i];
     if (!white.test(node.nodeValue)) {
      if(!$(node).closest('.annotator-handle').length && !$(node).closest('.biblioref').length && !$(node).closest('.annotator-hl[shareable="true"]').length) {
         _results.push($(node).wrapAll(hl).parent().prepend(handle).show()[0]);
         if($(node).closest('.pxereaderSearchHighlight').length > 0) {
           $(node).parent().find('.annotator-handle').text(noteText).css('background-color', normedRange.color);
         }
         handle='';
      }
     }
   }
   window.getSelection().removeAllRanges();
   window.getSelection().addRange(normedRange.toRange());
   this.alignMathMlNote();
   this.alignNotes();
   return _results;
 };

  Annotator.prototype.highlightRanges = function(normedRanges, cssClass) {
    var highlights, r, _i, _len;
    if (cssClass == null) {
      cssClass = 'annotator-hl';
    }
    highlights = [];
    for (_i = 0, _len = normedRanges.length; _i < _len; _i++) {
      r = normedRanges[_i];
      $.merge(highlights, this.highlightRange(r, cssClass));
    }
    return highlights;
  };

  Annotator.prototype.addPlugin = function(name, options) {
    var klass, _base;
    if (this.plugins[name]) {
      console.error(_t("You cannot have more than one instance of any plugin."));
    } else {
      klass = Annotator.Plugin[name];
      if (typeof klass === 'function') {
        this.plugins[name] = new klass(this.element[0], options);
        this.plugins[name].annotator = this;
        if (typeof (_base = this.plugins[name]).pluginInit === "function") {
          _base.pluginInit();
        }
      } else {
        console.error(_t("Could not load ") + name + _t(" plugin. Have you included the appropriate <script> tag?"));
      }
    }
    return this;
  };

  Annotator.prototype.showEditor = function(annotation, location, isAdderClick, event) {
    var height=0,annId = annotation?annotation.id:'',len;
    //len = $('span[data-ann-id='+annId+']').length;
    var annElement = $('span[data-ann-id='+annId+']')[0];
    if(annElement) {
      var noteIconHght=0;
      if($(annElement).find('.annotator-handle').length>0)
        noteIconHght = isNaN(parseInt($(annElement.innerHTML).css('margin-top')))?0:parseInt($(annElement.innerHTML).css('margin-top'));
      height = $(annElement).offset().top+noteIconHght;
    }
    else
      height = location.top + 30;
    var selctionOverlap = '', position;
    if(window.getSelection().rangeCount > 0) {
     selctionOverlap = window.getSelection().getRangeAt(0);
    }
    var iscolorPanel = selctionOverlap ? $(selctionOverlap.startContainer).hasClass('annotator-color-container'):'';
    if (iscolorPanel && isAdderClick == false && $('.annotator-editor .annotator-panel-2 .annotator-listing').css('display') == 'none')
      isAdderClick = true;
    position = {
      top: height
    }
    
    this.editor.element.css(position);
    this.editor.load(annotation,this.isShareable,height, event);
    this.publish('annotationEditorShown', [this.editor, annotation]);
    if(selctionOverlap.toString()!= '' && ($(selctionOverlap.startContainer).hasClass('annotator-hl') || $(selctionOverlap.endContainer).hasClass('annotator-hl'))) {
      $('.annotator-editor').addClass('overlapingpopup');
    } else {
      $('.annotator-editor').removeClass('overlapingpopup');
    }
    return this;
  };

  Annotator.prototype.onEditorHide = function() {
    window.currAnn = [];
    this.publish('annotationEditorHidden', [this.editor]);
    return this.ignoreMouseup = false;
  };

  Annotator.prototype.onEditorSubmit = function(annotation) {
    this.alignMathMlNote();
    this.alignNotes();
    if(annotation.shareable) {
      return;
    }
    return this.publish('annotationEditorSubmit', [this.editor, annotation]);
  };

  Annotator.prototype.showViewer = function(annotations, location) {
    this.viewer.element.css(location);
    this.viewer.load(annotations);
    return this.publish('annotationViewerShown', [this.viewer, annotations]);
  };

  Annotator.prototype.startViewerHideTimer = function() {
    if (!this.viewerHideTimer) {
      return this.viewerHideTimer = setTimeout(this.viewer.hide, 250);
    }
  };

  Annotator.prototype.clearViewerHideTimer = function() {
    clearTimeout(this.viewerHideTimer);
    return this.viewerHideTimer = false;
  };

  Annotator.prototype.checkForStartSelection = function(event) {
    if (!(event && this.isAnnotator(event.target))) {
      this.startViewerHideTimer();
    }
    return this.mouseIsDown = true;
  };

   Annotator.prototype.getSelectedAnnotations = function() {
    var getHTMLContents = window.getSelection().getRangeAt(0);
    var elementSelection = $(getHTMLContents.cloneContents()).context.children;
    var ancesterContainer = getHTMLContents.commonAncestorContainer;
    var annArray =[];
    if($(elementSelection).hasClass('annotator-editor')) {
      annArray.push(1,2);
      return annArray;
    }
    if(elementSelection.length == 0) {  //Checks overlapping on the same content
      var selectedText = getHTMLContents.cloneContents().textContent;
      elementSelection = [];
      if(selectedText==getHTMLContents.startContainer.innerText 
        && $(getHTMLContents.startContainer).hasClass('annotator-hl'))
        elementSelection.push(getHTMLContents.startContainer)
      else if($(ancesterContainer).hasClass('annotator-hl'))
        elementSelection.push(ancesterContainer);
    }
    if(elementSelection.length>0){  //finds overlapping annotations
      var hlElements,dataAnnId,shrable
        for (var i=0;i<=elementSelection.length;i++){
          hlElements = $(elementSelection[i]).find('.annotator-hl');
          if (hlElements.length>0){
            for(var j=0;j<=hlElements.length;j++){
              dataAnnId = $(hlElements[j]).attr('data-ann-id');
              shrable = $(hlElements[j]).attr('shareable');
              if (dataAnnId !== undefined && $.inArray(dataAnnId,annArray)<0)
                if (!shrable || shrable==='false')
                  annArray.push(dataAnnId);
              }
            }
          if (hlElements.context && hlElements.context.hasAttribute('data-ann-id')) {
              dataAnnId = $(hlElements.context).attr('data-ann-id');
              shrable = $(hlElements.context).attr('shareable');
              if (dataAnnId !== undefined && $.inArray(dataAnnId,annArray)<0)
                if (!shrable || shrable==='false')
                  annArray.push(dataAnnId);
          }
          else if (annArray.length === 0 && $(ancesterContainer).hasClass('annotator-hl')) {
             dataAnnId = $(ancesterContainer).attr('data-ann-id');
             shrable = $(ancesterContainer).attr('shareable');
             if (dataAnnId !== undefined && $.inArray(dataAnnId,annArray)<0)
               if (!shrable || shrable==='false')
                 annArray.push(dataAnnId);
          }
        }
     }
     return annArray;
  };

  Annotator.prototype.checkForEndSelection = function(event) {
    if($(event.target).closest('.aquila-image-viewer, .ReactModalPortal').length)
     return false;
    var container, range, _i, _len, _ref;
    this.mouseIsDown = false;
    this.selectedAnnArr=[];
    this.ignoreMouseup=$(event.target).hasClass('annotator-confirm-delete')?false:this.ignoreMouseup;
    if (this.ignoreMouseup) {
      return;
    }
    this.selectedRanges = this.getSelectedRanges();
    _ref = this.selectedRanges;
    if(_ref.length>0) {
      this.selectedAnnArr = this.getSelectedAnnotations();
      if(this.selectedAnnArr.length > 1) {
        window.getSelection().removeAllRanges();
        return;
      }
    }
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      range = _ref[_i];
      container = range.commonAncestor;
      if (this.isAnnotator(container)) {
        return;
      }
    }
    if (event && this.selectedRanges.length) {
      this.onAdderClick(event);
      this.onAdderMousedown();
      return this.adder;
    } else {
      return this.adder.hide();
    }
  };

  Annotator.prototype.isAnnotator = function(element) {
    return !!$(element).parents().addBack().filter('[class^=annotator-]').not('[class^=annotator-hl]').not(this.wrapper).length;
  };

  Annotator.prototype.onHighlightMouseover = function(event) {
    var annotations;
    this.clearViewerHideTimer();
    if (this.mouseIsDown) {
      return false;
    }
    if (this.viewer.isShown()) {
      this.viewer.hide();
    }
    annotations = $(event.target).parents('.annotator-hl').addBack().map(function() {
      return $(this).data("annotation");
    }).toArray();
    return this.showViewer(annotations, Util.mousePosition(event, this.wrapper[0]));
  };

  Annotator.prototype.onHighlightClick = function(event) {
    event.stopPropagation();
    this.alignNotes();
    this.alignMathMlNote();
    var currAnnPosition=0,_i;
    if(this.selectedAnnArr.length > 0)
      return false;
    var annotations = $(event.target).closest('.annotator-hl').addBack().map(function() {
      return $(this).data("annotation");
    }).toArray();
    for (_i = 0; _i <annotations.length ; _i++) {
      if($(annotations)[_i].shareable)
        currAnnPosition = _i;
       if(!($(annotations)[_i].id))
        currAnnPosition++;
    };
    this.showEditor(annotations[currAnnPosition], Util.mousePosition(event, this.wrapper[0]), false);
 
  }

  Annotator.prototype.onAdderMousedown = function(event) {
    if (event != null) {
      event.preventDefault();
    }
    return this.ignoreMouseup = true;
  };

  Annotator.prototype.clearTextSelection =function (){
    if (window.getSelection) {
      if (window.getSelection().empty) {  // Chrome
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {  // Firefox
        window.getSelection().removeAllRanges();
      }
    } else if (document.selection) {  // IE?
      document.selection.empty();
    }
  }

  Annotator.prototype.onAdderClick = function(event) {
    var annArray =[],oldAnnArr=[],annObjElement;
    var annotation, cancel, cleanup, position, save;
    var windowSelection = window.getSelection(), selctionOverlap = windowSelection.getRangeAt(0);
    annArray = this.getSelectedAnnotations();
     if(annArray.length>0) {
      var hlElements = $(event.target).addBack().find('.annotator-hl');
          if(hlElements.length>0){
              for( var j=0;j<=hlElements.length;j++){
                  var dataAnnId = $(hlElements[j]).attr('data-ann-id');
                    if(dataAnnId !== undefined && $.inArray(dataAnnId,annArray)>=0)
                      annObjElement = hlElements[j];
              }
          } else {
            var isstartHl = $(selctionOverlap.startContainer).hasClass('annotator-hl'), isendHl = $(selctionOverlap.endContainer).hasClass('annotator-hl');
            if (isstartHl) {
              if($.inArray($(selctionOverlap.startContainer).attr('data-ann-id'),annArray)>=0)
                      annObjElement = $(selctionOverlap.startContainer);
            }
            if (isendHl) {
              if($.inArray($(selctionOverlap.endContainer).attr('data-ann-id'),annArray)>=0)
                      annObjElement = $(selctionOverlap.endContainer);
            }
          } 
          if(!annObjElement && hlElements.context && hlElements.context.outerHTML.match('.annotator-hl'))
            annObjElement = hlElements.context;
            oldAnnArr = $(annObjElement).parents('.annotator-hl').addBack().map(function() {
                  return $(this).data("annotation");
                  }).toArray();
     }
    if (event != null) {
      event.preventDefault();
    }
    this.adder.hide();
    annotation = this.setupAnnotation(this.createAnnotation());
    event.pageY=$(annotation.highlights).offset().top;
    position = Util.mousePosition(event, this.wrapper[0]);
    // this.clearTextSelection();
    $(annotation.highlights).addClass('annotator-hl-temporary');
    save = (function(_this) {
      return function() {
        cleanup();
        $(annotation.highlights).removeClass('annotator-hl-temporary');
        return _this.publish('annotationCreated', [annotation]);
      };
    })(this);
    cancel = (function(_this) {
      return function() {
        cleanup();
        return _this.deleteAnnotation(annotation);
      };
    })(this);
    cleanup = (function(_this) {
      return function() {
        _this.unsubscribe('annotationEditorHidden', cancel);
        return _this.unsubscribe('annotationEditorSubmit', save);
      };
    })(this);
     if(oldAnnArr.length>0 && annArray.length>0) { //&& !(oldAnnArr[0].shareable)
      $(annotation)[0].text = $(oldAnnArr)[0].text;
      $('.annotator-edit-container').hide();
      window.currAnn = $(oldAnnArr)[0];
    }
    this.subscribe('annotationEditorHidden', cancel);
    this.subscribe('annotationEditorSubmit', save);
    return this.showEditor(annotation, position, true, event);
  };

  Annotator.prototype.onEditAnnotation = function(annotation) {
    var cleanup, offset, update;
    offset = this.viewer.element.position();
    update = (function(_this) {
      return function() {
        cleanup();
        return _this.updateAnnotation(annotation);
      };
    })(this);
    cleanup = (function(_this) {
      return function() {
        _this.unsubscribe('annotationEditorHidden', cleanup);
        return _this.unsubscribe('annotationEditorSubmit', update);
      };
    })(this);
    this.subscribe('annotationEditorHidden', cleanup);
    this.subscribe('annotationEditorSubmit', update);
    this.viewer.hide();
    return this.showEditor(annotation, offset, false);
  };

  Annotator.prototype.onDeleteAnnotation = function(annotation) {
    this.viewer.hide();
    return this.deleteAnnotation(annotation);
  };

  return Annotator;

})(Delegator);

Annotator.Plugin = (function(_super) {
  __extends(Plugin, _super);

  function Plugin(element, options) {
    Plugin.__super__.constructor.apply(this, arguments);
  }

  Plugin.prototype.pluginInit = function() {};

  return Plugin;

})(Delegator);

g = Util.getGlobal();

if (((_ref = g.document) != null ? _ref.evaluate : void 0) == null) {
  $.getScript('http://assets.annotateit.org/vendor/xpath.min.js');
}

if (g.getSelection == null) {
  $.getScript('http://assets.annotateit.org/vendor/ierange.min.js');
}

if (g.JSON == null) {
  $.getScript('http://assets.annotateit.org/vendor/json2.min.js');
}

if (g.Node == null) {
  g.Node = {
    ELEMENT_NODE: 1,
    ATTRIBUTE_NODE: 2,
    TEXT_NODE: 3,
    CDATA_SECTION_NODE: 4,
    ENTITY_REFERENCE_NODE: 5,
    ENTITY_NODE: 6,
    PROCESSING_INSTRUCTION_NODE: 7,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9,
    DOCUMENT_TYPE_NODE: 10,
    DOCUMENT_FRAGMENT_NODE: 11,
    NOTATION_NODE: 12
  };
}

Annotator.$ = $;

Annotator.Delegator = Delegator;

Annotator.Range = Range;

Annotator.Util = Util;

Annotator._instances = [];

Annotator._t = _t;

Annotator.supported = function() {
  return (function() {
    return !!this.getSelection;
  })();
};

Annotator.noConflict = function() {
  Util.getGlobal().Annotator = _Annotator;
  return this;
};

$.fn.annotator = function(options) {
  var args;
  args = Array.prototype.slice.call(arguments, 1);
  return this.each(function() {
    var instance;
    instance = $.data(this, 'annotator');
    if (options === 'destroy') {
      $.removeData(this, 'annotator');
      return instance != null ? instance.destroy(args) : void 0;
    } else if (instance) {
      return options && instance[options].apply(instance, args);
    } else {
      instance = new Annotator(this, options);
      return $.data(this, 'annotator', instance);
    }
  });
};

this.Annotator = Annotator;

//# sourceMappingURL=annotator.map;// Generated by CoffeeScript 1.7.1
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Annotator.Widget = (function(_super) {
  __extends(Widget, _super);

  Widget.prototype.classes = {
    hide: 'annotator-hide',
    invert: {
      x: 'annotator-invert-x',
      y: 'annotator-invert-y'
    }
  };

  function Widget(element, options) {
    Widget.__super__.constructor.apply(this, arguments);
    this.classes = $.extend({}, Annotator.Widget.prototype.classes, this.classes);
  }

  Widget.prototype.destroy = function() {
    this.removeEvents();
    return this.element.remove();
  };

  Widget.prototype.checkOrientation = function() {
    var current, offset, viewport, widget, window;
    this.resetOrientation();
    window = $(Annotator.Util.getGlobal());
    widget = this.element.children(":first");
    offset = widget.offset();
    viewport = {
      top: window.scrollTop(),
      right: window.width() + window.scrollLeft()
    };
    current = {
      top: offset.top,
      right: offset.left + widget.width()
    };
    if ((current.top - viewport.top) < 0) {
      this.invertY();
    }
    if ((current.right - viewport.right) > 0) {
      this.invertX();
    }
    return this;
  };

  Widget.prototype.resetOrientation = function() {
    this.element.removeClass(this.classes.invert.x).removeClass(this.classes.invert.y);
    return this;
  };

  Widget.prototype.invertX = function() {
    this.element.addClass(this.classes.invert.x);
    return this;
  };

  Widget.prototype.invertY = function() {
    this.element.addClass(this.classes.invert.y);
    return this;
  };

  Widget.prototype.isInvertedY = function() {
    return this.element.hasClass(this.classes.invert.y);
  };

  Widget.prototype.isInvertedX = function() {
    return this.element.hasClass(this.classes.invert.x);
  };

  return Widget;

})(Delegator);

//# sourceMappingURL=widget.map
;// Generated by CoffeeScript 1.7.1
var __bind = function(fn, me) { return function() { return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
Annotator.Editor = (function(_super) {
  __extends(Editor, _super);

  Editor.prototype.events = {
    'form submit': 'submit',
    '.annotator-save click': 'submit',
    '.annotator-cancel click': 'hide',
    '.annotator-cancel mouseover': 'onCancelButtonMouseover',
    'textarea keydown': 'processKeypress',
    '.annotator-color click':'onColorChange',
    '.annotator-share click':'onShareClick',
    '.annotator-confirm-delete click':'onDeleteClick',
    '.annotator-edit-container click':'onEditClick',
    '.annotator-listing textarea keyup':'onNoteChange',
    '.annotator-delete-container click':'onDeleteIconClick',
    '.annotator-confirm-cancel click':'onCancelClick',
    '.annotator-color-select-container click': 'onAnnotatorColorChange',
    '.annotator-edit-Note-Panel-1-rect click' : 'onEditRectClick',
    '.annotator-edit-Note-Panel-1-circle click' : 'onEditColorChange',
    '#noteContainer click' : 'onNoteContainerClick',
    '.annotator-select-outer-circle,.annotator-select-rect,.annotator-delete-container,.annotator-confirm-cancel,.annotator-confirm-delete,.annotator-edit-Note-Panel-1-rect,.annotator-edit-Note-Panel-1-circle,#noteContainer keyup': 'onKeyupClick'
  };

  Editor.prototype.classes = {
    hide: 'annotator-hide',
    focus: 'annotator-focus'
  };
  
  Editor.prototype.isShareable=null;
  Editor.prototype.textareaHeight=null;
  Editor.prototype.currentAnnotation=null;
  Editor.prototype.const={
    characters :3000
  }
  var language = window.annotationLocale || 'en-US';
  var panel1 = '<div class="annotator-panel-1 annotator-panel-triangle"> \
                  <div class="annotator-color-container">\
                    <div> \
                      <div class = "annotator-color-select-container yellowColorBtn" title = "Main ideas" value="#55DF49"> \
                        <div class = "annotator-select-outer-circle positionAbs" tabindex="1"> \
                          <div class = "annotator-select-inner-circle hide" value="#55DF49"></div> \
                        </div> \
                        <div tabindex="2" class = "annotator-select-rect positionRel annotator-Rect-Pos annotator-pane1-font annotator-pane1-rect-background-green">' +locale_data[language]['mainIdeas']+'</div> \
                      </div> \
                      <div class = "annotator-color-select-container" title = "Questions" value="#FFD232"> \
                        <div class = "annotator-select-outer-circle positionAbs" tabindex="3"> \
                          <div class = "annotator-select-inner-circle hide" value="#FFD232"></div> \
                        </div> \
                        <div tabindex="4" class = "annotator-select-rect positionRel annotator-Rect-Pos annotator-pane1-font annotator-pane1-rect-background-sepia">' +locale_data[language]['questions']+'</div> \
                      </div> \
                      <div class = "annotator-color-select-container" title = "Observations" value="#FC92CF"> \
                        <div class = "annotator-select-outer-circle positionAbs" tabindex="5"> \
                          <div class = "annotator-select-inner-circle hide" value="#FC92CF"></div> \
                        </div> \
                        <div tabindex="6" class = "annotator-select-rect positionRel annotator-Rect-Pos annotator-pane1-font annotator-pane1-rect-background-pink">' +locale_data[language]['observations']+'</div> \
                      </div> \
                    </div> \
                  </div> \
                  <div class = "annotator-select-container"> \
                    <div> \
                      <!-- div class="annotator-delete-container" title="' + locale_data[language]['delete'] + '"></div --> \
                      <!-- div class="annotator-edit-container" title="' + locale_data[language]['edit'] + '"></div --> \
                    </div> \
                  </div> \
                  <div class = "edit-Note-Panel-1">  <!-- Edit Note Panel-->\
                    <div> <!-- Edit Note circle-->\
                      <div class = "edit-note-circle"> \
                        <div class= "annotator-edit-Note-Panel-1-circle annotator-edit-Note-Panel-1-circle-green" tabindex="1" value="#55DF49"> \
                        </div> \
                        <div class= "annotator-edit-Note-Panel-1-circle annotator-edit-Note-Panel-1-circle-sepia" tabindex="2" value="#FFD232"> \
                        </div > \
                        <div class= "annotator-edit-Note-Panel-1-circle annotator-edit-Note-Panel-1-circle-pink" tabindex="3" value="#FC92CF"> \
                        </div > \
                      </div> \
                      <div class = "edit-note-rect"> <!-- Edit Note Rectangle-->\
                        <div> \
                          <div class = "annotator-select-rect hide annotator-pane1-font annotator-pane1-rect-background-green annotator-edit-Note-Panel-1-rect" tabindex="0" value="#55DF49">' +locale_data[language]['mainIdeas']+'</div> \
                        </div> \
                                \
                        <div> \
                          <div class = "annotator-select-rect hide annotator-pane1-font annotator-pane1-rect-background-sepia annotator-edit-Note-Panel-1-rect" tabindex="0" value="#FFD232">' +locale_data[language]['questions']+'</div> \
                        </div> \
                                \
                        <div> \
                          <div class = "annotator-select-rect hide annotator-pane1-font annotator-pane1-rect-background-pink annotator-edit-Note-Panel-1-rect" tabindex="0" value="#FC92CF">' +locale_data[language]['observations']+'</div> \
                        </div> \
                        <div> \
                          <div class = "annotator-select-rect hide annotator-pane1-font annotator-pane1-rect-background-blue annotator-edit-Note-Panel-1-rect" tabindex="0" value="#ccf5fd">' +locale_data[language]['instructor']+'</div> \
                        </div> \
                      </div> \
                              \
                    </div> \
                  </div> \
                </div>'

  var panel2 ='<div class="annotator-panel-2"><ul class="annotator-listing"></ul></div>';

  var panel3 ='<div class="annotator-panel-3"> \
                <div class="annotator-controls"> \
                  <div class="annotator-delete-container" tabindex="0" title="' + locale_data[language]['delete'] + '"> \
                  </div> \
                  <div class="ann-cancel-delete-confirm-section hide"> \
                    <div class="ann-confirm-section"> \
                      <label class="annotator-confirm">' + locale_data[language]['confirm'] + '?</label> \
                    </div> \
                    <div class = "ann-canceldelete-section"> \
                      <a class="annotator-confirm-cancel" tabindex="0" title="' + locale_data[language]['cancel'] + '">' + locale_data[language]['cancel'] + '</a> \
                      <a class="annotator-confirm-delete" tabindex="0" title="' + locale_data[language]['delete'] + '">' + locale_data[language]['delete'] + '</a> \
                    </div> \
                  </div> \
                  <!--div class="ann-share-section"> \
                    <label class="annotator-share-text">' + locale_data[language]['share'] + '</label> \
                      <div class="annotator-share" title="' + locale_data[language]['share'] + '"> \
                      </div> \
                  </div --> \
                  <div class="ann-cancelsave-section"> \
                    <!-- a class="annotator-cancel" title="' + locale_data[language]['cancel'] + '">' + locale_data[language]['cancel'] + '</a > \
                    <a class="annotator-save annotator-focus" title="' + locale_data[language]['save'] + '">' + locale_data[language]['save'] + '</a --> \
                  </div> \
                </div> \
              </div>'; 

  var panel4 ='<div class="annotator-panel-4 annotator-panel-triangle"><div class="ann-confirm-section"><label class="annotator-confirm">' + locale_data[language]['confirm'] + '?</label></div><div class="ann-canceldelete-section"><a class="annotator-confirm-delete" title="' + locale_data[language]['delete'] + '">' + locale_data[language]['delete'] + '</a><a class="annotator-confirm-cancel" title="' + locale_data[language]['cancel'] + '">' + locale_data[language]['cancel'] + '</a></div></div></div>';

  var panel5 ='<li style="display:none"; class="characters-left"><span id="letter-count">'+(Editor.prototype.const.characters)+'</span id="letter-text">  ' + locale_data[language]['charleft'] + '<span><span></li>';

  Editor.prototype.html = '<div class="annotator-outer annotator-editor hide-note"><form class="annotator-widget">'+panel1+ panel2+panel3+'</form></div>';
  
  Editor.prototype.options = {};

  Editor.prototype.randomId = 0;

  function Editor(options) {
    this.onCancelButtonMouseover = __bind(this.onCancelButtonMouseover, this);
    this.processKeypress = __bind(this.processKeypress, this);
    this.submit = __bind(this.submit, this);
    this.load = __bind(this.load, this);
    this.hide = __bind(this.hide, this);
    this.show = __bind(this.show, this);
    this.onColorChange=__bind(this.onColorChange, this);
    this.onShareClick=__bind(this.onShareClick, this);
    this.onDeleteClick=__bind(this.onDeleteClick, this);
    this.onDeleteIconClick=__bind(this.onDeleteIconClick, this);
    this.onCancelClick=__bind(this.onCancelClick, this);
    this.onEditClick=__bind(this.onEditClick, this);
    this.onNoteChange=__bind(this.onNoteChange, this);
    Editor.__super__.constructor.call(this, $(this.html)[0], options);
    this.fields = [];
    this.annotation = {};
  }

  Editor.prototype.onAnnotatorColorChange = function(e) {
    var title = '';
    var dom;
    if(e.target.parentElement.getAttribute('title')) {
      title = e.target.parentElement.getAttribute('title')
      dom = e.target.parentElement;
    } else if(e.target.getAttribute('title')) {
      title = e.target.getAttribute('title')
      dom = e.target;
    }
    $('.annotator-select-inner-circle').hide();
    $('.annotator-select-outer-circle').removeClass('circleborder');
    $(dom).find('.annotator-select-inner-circle').show();
    $(dom).find('.annotator-select-outer-circle').addClass('circleborder');

    $('.ann-cancel-delete-confirm-section').hide();
    $('.annotator-delete-container').show()

    this.onColorChange(dom);
  }

  Editor.prototype.onNoteContainerClick= function(e) { 
    if ($('.annotator-widget').hasClass("instructorNote"))
      return;
    $("#noteContainer").hide();
    var annotator_editor = $('.annotator-editor')
    annotator_editor.css({ top : annotator_editor.position().top});
    $('.annotator-panel-2').find('textarea').show().css({"pointer-events": "all", "opacity": "1"});
    $('.annotator-panel-2').find('textarea').focus();
    $(".annotator-panel-triangle").addClass("annotator-panel-triangle1").removeClass("annotator-panel-triangle");
  }

  Editor.prototype.onKeyupClick= function(e) { 
    var keycode = e.keyCode;
    if(keycode == 13 || keycode == 32) {
      $(e.target).trigger('click');
    }
  }

  Editor.prototype.onEditColorChange= function(e) { 
    e.preventDefault();
    var editNoteCircleDom = $(".edit-note-circle");
    var value = $(e.target).attr('value');
    editNoteCircleDom.find('.annotator-edit-Note-Panel-1-circle').css({"border": "0px","height": "18px", "width": "18px"});
    editNoteCircleDom.find(("[value=" + "'" + value + "']")).css({ "border": "solid 1px #19a6a4","height": "20px", "width": "20px"});

    $('.annotator-edit-Note-Panel-1-rect').hide();
    $('.edit-note-rect').find(("[value=" + "'" + value + "']")).show();
    this.onColorChange(e.target);
  }

  Editor.prototype.onEditRectClick = function(e) { 
    var editNoteCircleDom = $(".edit-note-circle");
    var value = $(e.target).attr('value');
    editNoteCircleDom.show();
    editNoteCircleDom.find('.annotator-edit-Note-Panel-1-circle').css({"border": "0px","height": "18px", "width": "18px"}); // reset to default circle
    editNoteCircleDom.find(("[value=" + "'" + value + "']")).css({ "border": "solid 1px #19a6a4","height": "20px", "width": "20px"}).focus(); // highlight the selected circle
    $(".edit-note-rect").css({"padding" : "0px","margin-top": "-43px","margin-left": "99px"});
    $("#noteContainer").attr("tabindex", "4");
    $('.annotator-delete-container,.annotator-confirm-cancel,.annotator-confirm-delete').attr('tabindex', 5);
    if(value === "#55DF49") { // Green

    } else if(value ==="#FFD232") { // Sepia

    } else { // pink

    }
    //$(e.target).attr('value')
  }
  
  Editor.prototype.unShareAnnotation=function() {
     this.annotation.colorCode=this.annotation.lastColor;
     if(this.annotation.colorCode == '#FFD232') { //Yellow
         annBgColor = 'rgba(255,210,50,0.4)';
     } else if (this.annotation.colorCode == '#55DF49') { //Green
         annBgColor = '#bbf2b6';
     } else if (this.annotation.colorCode == '#FC92CF') { //Pink
         annBgColor = '#fed3ec';
     } 
     this.annotation.shareable=false;
     $(this.annotation.highlights).css('background', annBgColor);
     $('.annotator-color').removeClass('active');
     $('.annotator-color[value="'+this.annotation.colorCode+'"]').addClass('active');
     $('.annotator-color-container').removeClass('disabled-save');
     $(this.annotation.highlights).removeClass('sharedNote');
  }
  Editor.prototype.onShareClick=function(event) {
    var that=this;
    this.fromOnShare=true;
    if ($(event.target).hasClass('on')) {
      $(event.target).removeClass('on');
      this.unShareAnnotation();
    }
    else {
      $(event.target).addClass('on');
      this.annotation.colorCode='#ccf5fd';
      this.annotation.shareable=true;
      $('.annotator-color').removeClass('active');
      $(this.annotation.highlights).css('background', '#ccf5fd');
      $(this.annotation.highlights).addClass('sharedNote');
      $('.annotator-color-container').addClass('disabled-save');
    }
    setTimeout(function(){ that.submit(); }, 800);    
  }
  
  Editor.prototype.onDeleteClick=function(event) {  
    this.element.addClass(this.classes.hide);
    var panel1Sec =  this.element.find('.annotator-panel-1'), panel2Sec =  this.element.find('.annotator-panel-2'), panel3Sec =  this.element.find('.annotator-panel-3'), panel4Sec = this.element.find('.annotator-panel-4') ;
    panel1Sec.removeClass('hide-popup');
    panel2Sec.removeClass('overlay');
    panel3Sec.removeClass('overlay');
    panel4Sec.remove();
    this.element.addClass('hide-note')
    return $('.annotator-outer.annotator-viewer').triggerHandler.apply($('.annotator-outer.annotator-viewer'), ['delete', [this.annotation]]);
  }
  Editor.prototype.onDeleteIconClick=function(event) { 
    $(event.target).hide(); 
    $('.ann-cancel-delete-confirm-section').removeClass('hide').css({"display": "block"});
    /*var panel1Sec =  this.element.find('.annotator-panel-1'), panel2Sec =  this.element.find('.annotator-panel-2'), panel3Sec =  this.element.find('.annotator-panel-3'), panel4Sec = this.element.find('.annotator-panel-4');
    if($(panel2Sec).find('textarea').val().trim()) {
        panel1Sec.addClass('hide-popup').after(panel4);
        panel4Sec.addClass('annotator-panel-triangle');
        panel2Sec.addClass('overlay');
        panel3Sec.addClass('overlay');
        $(panel2Sec).find('textarea').attr('readonly','readonly');
    }
    else {
        this.onDeleteClick(event);
    }*/
  }
  Editor.prototype.onCancelClick=function(event) {  
    var panel1Sec =  this.element.find('.annotator-panel-1'), panel2Sec =  this.element.find('.annotator-panel-2'), panel3Sec =  this.element.find('.annotator-panel-3'), panel4Sec = this.element.find('.annotator-panel-4') ;
    panel1Sec.removeClass('hide-popup');
    panel2Sec.removeClass('overlay');
    panel3Sec.removeClass('overlay');
    panel4Sec.remove();
    $(".ann-cancel-delete-confirm-section").hide();
    $(".annotator-delete-container").show();
    $(panel2Sec).find('#noteContainer').focus();
    $(panel2Sec).find('textarea').removeAttr('readonly').focus();
  }

  Editor.prototype.onEditClick=function(event) {  
    this.element.addClass('show-edit-options');
    $(this.element).find('textarea').show();
    $(this.element).find('#noteContainer').hide();
    this.element.find('textarea').css({'pointer-events':'all', 'opacity':'1','min-height':'40px'});
    this.element.find('input').css({'pointer-events':'all', 'opacity':'1'});
    $(this.element).find('.annotator-color-container').removeClass('disabled-save');
  }
  
  Editor.prototype.onNoteChange=function(event) {
    this.element.addClass('show-edit-options');
    if(!event.target.value.length){
      $(this.element).find('.annotator-share-text, .annotator-share').hide();
    }
    var inputCharLength = event.currentTarget.value.length, actualChar = this.const.characters;
    var remainingCount = actualChar-inputCharLength;
    this.element.find('#letter-count').text((remainingCount>0 && remainingCount<51) ? '-'+remainingCount : remainingCount);
    $('.characters-left').css('display', (remainingCount < 51)?'block':'none');
    var selectors = this.element.find('.annotator-item textarea'); 
    var temp = selectors.height();
    this.textareaHeight = $('#annotator-field-'+this.randomId)[0].scrollHeight;
    if(temp!==this.textareaHeight) {
      var topPosition = $('.annotator-editor').css('top');
      this.element.css({top:topPosition});
    }    
  }

  Editor.prototype.onColorChange=function(target) {
   window.getSelection().removeAllRanges();
   this.element.removeClass('hide-note');
   var checkoverlap = $('.annotator-editor').hasClass('overlapingpopup');
   var isTopAlign=(!this.annotation.colorCode)?true:false;
   if(window.currAnn) {
    ($('#noteContainer').css('display') == 'block') ? $('.annotator-edit-container').show() : $('.annotator-edit-container').hide();
    $('.annotator-outer.annotator-viewer').triggerHandler.apply($('.annotator-outer.annotator-viewer'), ['delete', [window.currAnn]]);
   }
   if (this.annotation._id===undefined && this.currentAnnotation !== null) {     
    var curAnn =this.currentAnnotation;   
    Object.assign(this.annotation, curAnn);   
   }
   var colorCode = target.getAttribute('value');
   this.annotation.colorCode=this.annotation.lastColor=colorCode;
   /*$('.annotator-color').removeClass('active');
   $(event.target).addClass('active');*/
   if($(this.annotation.highlights).closest('.pxereaderSearchHighlight').length>0) {
    $(this.annotation.highlights).unwrap('.pxereaderSearchHighlight');
    $(this.annotation.highlights).parents().removeClass('pxereaderSearchHighlight');
    $(this.annotation.highlights).find('.annotator-handle').css('background-color', 'inherit');
   }
   var annBgColor = '', noteIconBgColor = '', noteText = '';
   if(colorCode == '#FFD232') { //Yellow
      annBgColor = 'rgba(255,210,50,0.4)';
      noteIconBgColor = '#ffedad';
      noteText = 'Q';
   } else if (colorCode == '#55DF49') { //Green
      annBgColor = noteIconBgColor = '#bbf2b6';
      noteText = 'M';
   } else if (colorCode == '#FC92CF') { //Pink
      annBgColor = noteIconBgColor = '#fed3ec';
      noteText = 'O';
   } else if (colorCode == '#ccf5fd') { //Share(Blue)
      annBgColor = noteIconBgColor = '#ccf5fd';
      noteText = 'I';
   } else { 
      annBgColor = noteIconBgColor = colorCode;
   }
   $(this.annotation.highlights).each(function() {
      if ($(this).parent().attr('shareable') == 'true') {
        $(this).css('background', 'inherit')
      } else {
        $(this).css('background', annBgColor);
      }
   });
   $(this.annotation.highlights).find('.annotator-handle').text(noteText).css('background-color', noteIconBgColor);  if (isTopAlign) {
      var topPosition=this.element.position().top + this.element.find('form').height()-this.element.find('.annotator-panel-1').height()-20;
      this.element.css({top:topPosition});
    }
    if (this.annotation.shareable) {
      $('.annotator-share').removeClass('on');
      this.unShareAnnotation();
    }
    if(checkoverlap) {
      $('#noteContainer').css('display', 'none');
      $('#annotator-field-0').css({'display':'inline-block', 'pointer-events': 'all','opacity': '1'});
      $('.annotator-edit-container').hide();
    }
    setTimeout(function() { $('#annotator-field-0').focus(); })  // To enable focus on textarea
    // this.publish('save', [this.annotation]);
    // if(isTopAlign)
    //    $('.annotator-outer.annotator-viewer').triggerHandler.apply($('.annotator-outer.annotator-viewer'), ['delete', [this.annotation]]);
    var annText = this.annotation.text;
    if(annText) {
      $('#noteContainer').attr('tabindex', 4);
      $('.annotator-delete-container,.annotator-confirm-cancel,.annotator-confirm-delete').attr('tabindex', 5);
    } else {
      $('.annotator-delete-container,.annotator-confirm-cancel,.annotator-confirm-delete,#noteContainer').attr('tabindex', 0);
    }
  }

  Editor.prototype.show = function(event, topPos) {
    Annotator.Util.preventEventDefault(event);
    this.element.removeClass(this.classes.hide);
    $(this.annotation.highlights).removeClass('current-annotation');
    if (!this.annotation.text || !this.annotation.text.length) $('.annotator-edit-container').hide();
    this.annotation.colorCode=this.annotation.colorCode||'';
    this.annotation.shareable=(this.annotation.shareable===undefined)?false:this.annotation.shareable;
    if (this.annotation.colorCode||this.annotation.shareable) {
      this.element.removeClass('hide-note');
      var textareaScroll =this.element.find('textarea').prop('offsetHeight') || 40,calPos,actualPos,oldHeight;
      oldHeight=this.element.find('textarea').height();
      this.element.find('textarea').height(textareaScroll);
      actualPos = this.element.position().top;
      if( this.element.find('textarea').val().length === 0 )
        textareaScroll = textareaScroll - $(this.element).find('#noteContainer').height();
      if(!(this.element.find('#mathTitle').css('display') === 'none'))
        actualPos = actualPos + 27;
      pos  = (textareaScroll-oldHeight) + actualPos;
      this.element.css({top:pos});
    } 
    if (this.annotation.shareable) {
      $('.annotator-share').addClass('on');
      $('.annotator-color-container').addClass('disabled-save');
      if (!this.isShareable)
        $('.annotator-panel-1').addClass('disabled-save');
    }
    else {
      $('.annotator-share').removeClass('on');
      $('.annotator-color-container').removeClass('disabled-save');
    }
    /*$('.annotator-color').removeClass('active');
    $('.annotator-color[value="'+this.annotation.colorCode+'"]').addClass('active');*/
    $('.annotator-select-inner-circle').hide(); // To hide all inner checkboxes
    $('.annotator-select-outer-circle').removeClass('circleborder');
    if (this.annotation.id && !$.trim(this.annotation.text).length) {
      this.element.find('.annotator-widget').addClass('emptyNote');
    } else {
      this.element.find('.annotator-widget').removeClass('emptyNote');
    }
    if(this.annotation.colorCode) { // For Edit container
      $('.annotator-color-select-container').hide(); 
      $('.edit-Note-Panel-1').show();
      $('.annotator-panel-1').css({height: "62px", position : "initial"});
      $(".edit-Note-Panel-1 .annotator-select-rect").hide();
      $(".edit-Note-Panel-1 .edit-note-circle").hide();
      $('.edit-Note-Panel-1').find("[value=" + this.annotation.colorCode + "]").show();
      $(".edit-note-rect").css({ "padding": "20px", "margin-top": "0px", "margin-left": "0px"});

      $('.ann-cancel-delete-confirm-section').hide();
      $('.annotator-delete-container').show();
      $('.annotator-panel-1').addClass('oldAnnotation');
      if(this.annotation.colorCode == '#ccf5fd') {
        this.element.find('.annotator-widget').addClass('instructorNote');
        //$('#noteContainer').css('pointer-events', 'none');
        $('.annotator-controls').hide();
        $('.annotator-editor').css({ top : topPos + $('.annotator-panel-1').height() + $('.annotator-panel-2 textarea').outerHeight(true)});
      } else {
        this.element.find('.annotator-widget').removeClass('instructorNote');
        $('#noteContainer').css('pointer-events', 'all');
        $('.annotator-controls').show();
        $('.annotator-editor').css({ top : topPos + $('.annotator-panel-1').height() + $('.annotator-panel-2 textarea').outerHeight(true) + $('.annotator-controls').height()});
      }
    } else { // Initial annotation
      $('.edit-Note-Panel-1').hide();
      $('.annotator-color-select-container').show();
      $('.annotator-panel-1').css({height: "110px", position : "relative"});
      $('.annotator-panel-1').removeClass('oldAnnotation');
      $('.annotator-editor').css({ top :$('.annotator-editor').position().top + $('.annotator-panel-1').height()});
    }
    this.element.find('.annotator-save').addClass(this.classes.focus);
    this.element.find('.annotator-listing .characters-left').remove();
    this.element.find('.annotator-listing').append(panel5);
    $('#letter-count').text(3000-this.element.find('textarea').val().length);
    this.checkOrientation();
    this.textareaHeight = $('#annotator-field-'+this.randomId)[0].scrollHeight || 22; 
    if(!$.trim(this.annotation.text) || !$.trim(this.annotation.text).length){
      this.element.find('textarea').css({'pointer-events':'all','opacity':'1'});
      this.element.find('input').css({'pointer-events':'all','opacity':'1'});
    }
    this.element.find(":input:first").focus();
    this.setupDraggables();
    if($.trim(this.element.find('textarea').val()).length > 0 && this.annotation.colorCode) {
      $(this.element).find('#noteContainer').html(linkifyStr(this.element.find('textarea').val()));
      $(this.element.find('textarea')).hide();
      $(this.element).find('#noteContainer').show();
    } else {
      $(this.element.find('textarea')).show();
      $(this.element).find('#noteContainer').hide();
    }
    $(".annotator-panel-triangle1").addClass("annotator-panel-triangle").removeClass("annotator-panel-triangle1");
    if(this.annotation.colorCode) 
      (this.annotation.colorCode != '#ccf5fd') && $(".annotator-edit-Note-Panel-1-rect[value=" + "'" + this.annotation.colorCode + "']").focus();
    else
      $('.annotator-select-outer-circle')[0].focus();
    return this.publish('show');
  };

  Editor.prototype.hide = function(event) {
   var annBgColor = '', noteIconBgColor = '', noteText = '', _i;
   if(this.annotation.colorCode == '#FFD232') { //Yellow
       annBgColor = 'rgba(255,210,50,0.4)';
       noteIconBgColor = '#ffedad';
       noteText = 'Q';
   } else if (this.annotation.colorCode == '#55DF49') { //Green
       annBgColor = noteIconBgColor = 'bbf2b6';
       noteText = 'M';
   } else if (this.annotation.colorCode == '#FC92CF') { //Pink
       annBgColor = noteIconBgColor = '#fed3ec';
       noteText = 'O'
   } else if (this.annotation.colorCode == '#ccf5fd') { //Share(Blue)
       annBgColor = noteIconBgColor = '#ccf5fd';
       noteText = 'I';
   } else {
       annBgColor = noteIconBgColor = this.annotation.colorCode;
   }
   var text = $('.annotator-panel-2').find('textarea').val();
   this.annotation.text = text;
   var noteVal = $.trim(this.annotation.text);
   var currentSelection = $(this.annotation.highlights); 
    for(_i=0; _i<currentSelection.length; _i++) {
      if($(currentSelection[_i]).find('.annotator-handle').length>0)
        break;
    }
    if(_i == currentSelection.length)
      $(currentSelection[0]).prepend("<span class='annotator-handle'></span>");
   $(this.annotation.highlights).each(function() {
      if ($(this).parent().attr('shareable') == 'true') {
        $(this).css('background', 'inherit')['addClass']('highlight-note');
      } else {
        $(this).css('background', annBgColor)['addClass']('highlight-note');
      }
   });
   $(this.annotation.highlights).find('.annotator-handle').each(function(i) {
      if(i == 0) {
        $(this).text(noteText).css('background-color', noteIconBgColor);
      }
   });
   Annotator.Util.preventEventDefault(event);
   this.element.addClass(this.classes.hide);
   this.element.addClass('hide-note').removeClass('show-edit-options');
   $('.annotator-edit-container').show();
   $('.annotator-panel-1').removeClass('disabled-save');
   this.onCancelClick();
   this.element.find('textarea').removeAttr('style');
   this.element.find('input').removeAttr('style'); 
   this.currentAnnotation = this.textareaHeight = null;
   if(this.annotation.colorCode && this.annotation.colorCode.length)
     this.publish('save', [this.annotation]);
   return this.publish('hide');
 };

  Editor.prototype.hasClass=function(element, className) {
    do {
      if (element.classList && element.classList.contains(className)) {
        return true;
      }
      element = element.parentNode;
    } while (element);
    return false;
  }
  Editor.prototype.load = function(annotation, isShareable, topPos, event) {
    this.isShareable=isShareable;
    if (!isShareable || (annotation && (!annotation.id || !annotation.text)))
      $('.annotator-share-text, .annotator-share').hide();
    else      
      $('.annotator-share-text, .annotator-share').show();
    if (!$('.annotator-item input').length) {
     $('.annotator-item').prepend('<input placeholder="' + locale_data[language]['addtitle'] + '." id = "mathTitle"/><div class="noteContainer" id = "noteContainer" tabindex="0"></div>');
    }
    $('.annotator-item input').val(annotation.quote);
    if(this.hasClass(annotation.highlights[0], 'MathJax')){
      $('.annotator-item input').show();
      if(!annotation.id){
          annotation.quote='';
          $('.annotator-item input').val('');
      }
    }else{
       $('.annotator-item input').hide()
    }
    var field, _i, _len, _ref;
    this.annotation = annotation;
    this.publish('load', [this.annotation]);
    _ref = this.fields;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      field = _ref[_i];
      field.load(field.element, this.annotation);
    }
    return this.show(event, topPos);
  };

  Editor.prototype.submit = function(event) {
    var field, _i, _len, _ref,currentSelection,count=0;
    Annotator.Util.preventEventDefault(event);
    if (this.fromOnShare) {
      this.fromOnShare=false
    }
    /*else if (this.annotation.shareable) {
      $('.annotator-share').removeClass('on');
      this.unShareAnnotation();
    }*/
    this.annotation.quote=$('.annotator-item input').val();
    var noteVal = $('#annotator-field-0').val();
    if (this.annotation.shareable) {
      if(!noteVal) {
        this.unShareAnnotation();
      }
    }
    _ref = this.fields;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      field = _ref[_i];
      field.submit(field.element, this.annotation);
    }
    currentSelection = $(this.annotation.highlights); 
    for(_i=0; _i<currentSelection.length; _i++) {
      if($(currentSelection[_i]).find('.annotator-handle').length>0)
        break;
    }
    if(_i == currentSelection.length)
          $(currentSelection[0]).prepend("<span class='annotator-handle'></span>")
    $(this.annotation.highlights)[(this.element.find('textarea').val().length)?'addClass':'removeClass']('highlight-note');
    // this.publish('save', [this.annotation]);
    return this.hide();
  };

  Editor.prototype.addField = function(options) {
    var element, field, input;
    this.randomId = Annotator.Util.uuid();
    field = $.extend({
      id: 'annotator-field-' + this.randomId,
      type: 'input',
      label: '',
      load: function() {},
      submit: function() {}
    }, options);
    input = null;
    element = $('<li class="annotator-item" />');
    field.element = element[0];
    switch (field.type) {
    case 'textarea':
      input = $('<textarea maxlength="3000"/>');
      break;
    case 'input':
    case 'checkbox':
      input = $('<input />');
      break;
    case 'select':
      input = $('<select />');
    }
    element.append(input);
    input.attr({
      id: field.id,
      placeholder: field.label
    });
    if (field.type === 'checkbox') {
      input[0].type = 'checkbox';
      element.addClass('annotator-checkbox');
      element.append($('<label />', {
        'for': field.id,
        html: field.label
      }));
    }
    this.element.find('ul:first').append(element);
    this.fields.push(field);
    return field.element;
  };

  Editor.prototype.checkOrientation = function() {
    var controls, list, panel3;
    Editor.__super__.checkOrientation.apply(this, arguments);
    list = this.element.find('ul');
    panel3 = this.element.find('.annotator-panel-3');
    controls = this.element.find('.annotator-controls');
    if (this.element.hasClass(this.classes.invert.y)) {
      panel3.html(controls);
    } else if (controls.is(':first-child')) {
      panel3.html(controls);
    }
    return this;
  };

  Editor.prototype.processKeypress = function(event) {
    if (event.keyCode === 27) {
      return this.hide();
    } else if (event.keyCode === 13 && !event.shiftKey) {
      // return this.submit();
      event.stopPropagation();
    }
    $('.annotator-delete-container,.annotator-confirm-cancel,.annotator-confirm-delete').attr('tabindex', 0);
  };

  Editor.prototype.onCancelButtonMouseover = function() {
    return this.element.find('.' + this.classes.focus).removeClass(this.classes.focus);
  };

  Editor.prototype.setupDraggables = function() {
    var classes, controls, cornerItem, editor, mousedown, onMousedown, onMousemove, onMouseup, resize, textarea, throttle;
    this.element.find('.annotator-resize').remove();
    if (this.element.hasClass(this.classes.invert.y)) {
      cornerItem = this.element.find('.annotator-item:last');
    } else {
      cornerItem = this.element.find('.annotator-item:first');
    }
    if (cornerItem) {
      $('<span class="annotator-resize"></span>').appendTo(cornerItem);
    }
    mousedown = null;
    classes = this.classes;
    editor = this.element;
    textarea = null;
    resize = editor.find('.annotator-resize');
    controls = editor.find('.annotator-controls');
    throttle = false;
    onMousedown = function(event) {
      if (event.target === this) {
        mousedown = {
          element: this,
          top: event.pageY,
          left: event.pageX
        };
        textarea = editor.find('textarea:first');
        $(window).bind({
          'mouseup.annotator-editor-resize': onMouseup,
          'mousemove.annotator-editor-resize': onMousemove
        });
        return event.preventDefault();
      }
    };
    onMouseup = function() {
      mousedown = null;
      return $(window).unbind('.annotator-editor-resize');
    };
    onMousemove = (function(_this) {
      return function(event) {
        var diff, directionX, directionY, height, width;
        if (mousedown && throttle === false) {
          diff = {
            top: event.pageY - mousedown.top,
            left: event.pageX - mousedown.left
          };
          if (mousedown.element === resize[0]) {
            height = textarea.height();
            width = textarea.width();
            directionX = editor.hasClass(classes.invert.x) ? -1 : 1;
            directionY = editor.hasClass(classes.invert.y) ? 1 : -1;
            textarea.height(height + (diff.top * directionY));
            textarea.width(width + (diff.left * directionX));
            if (textarea.height() !== height) {
              mousedown.top = event.pageY;
            }
            if (textarea.width() !== width) {
              mousedown.left = event.pageX;
            }
          } else if (mousedown.element === controls[0]) {
            editor.css({
              top: parseInt(editor.css('top'), 10) + diff.top,
              left: parseInt(editor.css('left'), 10) + diff.left
            });
            mousedown.top = event.pageY;
            mousedown.left = event.pageX;
          }
          throttle = true;
          return setTimeout(function() {
            return throttle = false;
          }, 1000 / 60);
        }
      };
    })(this);
    resize.bind('mousedown', onMousedown);
    return controls.bind('mousedown', onMousedown);
  };

  return Editor;

})(Annotator.Widget);

//# sourceMappingURL=editor.map;// Generated by CoffeeScript 1.7.1
var LinkParser,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Annotator.Viewer = (function(_super) {
  __extends(Viewer, _super);

  Viewer.prototype.events = {
    ".annotator-edit click": "onEditClick",
    ".annotator-delete click": "onDeleteClick"
  };

  Viewer.prototype.classes = {
    hide: 'annotator-hide',
    showControls: 'annotator-visible'
  };

  Viewer.prototype.html = {
    element: "<div class=\"annotator-outer annotator-viewer\">\n  <ul class=\"annotator-widget annotator-listing\"></ul>\n</div>",
    item: "<li class=\"annotator-annotation annotator-item\">\n  <span class=\"annotator-controls\">\n    <a href=\"#\" title=\"View as webpage\" class=\"annotator-link\">View as webpage</a>\n    <button title=\"Edit\" class=\"annotator-edit\">Edit</button>\n    <button title=\"Delete\" class=\"annotator-delete\">Delete</button>\n  </span>\n</li>"
  };

  Viewer.prototype.options = {
    readOnly: false
  };

  function Viewer(options) {
    this.onDeleteClick = __bind(this.onDeleteClick, this);
    this.onEditClick = __bind(this.onEditClick, this);
    this.load = __bind(this.load, this);
    this.hide = __bind(this.hide, this);
    this.show = __bind(this.show, this);
    Viewer.__super__.constructor.call(this, $(this.html.element)[0], options);
    this.item = $(this.html.item)[0];
    this.fields = [];
    this.annotations = [];
  }

  Viewer.prototype.show = function(event) {
    var controls;
    Annotator.Util.preventEventDefault(event);
    controls = this.element.find('.annotator-controls').addClass(this.classes.showControls);
    setTimeout(((function(_this) {
      return function() {
        return controls.removeClass(_this.classes.showControls);
      };
    })(this)), 500);
    this.element.removeClass(this.classes.hide);
    return this.checkOrientation().publish('show');
  };

  Viewer.prototype.isShown = function() {
    return !this.element.hasClass(this.classes.hide);
  };

  Viewer.prototype.hide = function(event) {
    Annotator.Util.preventEventDefault(event);
    this.element.addClass(this.classes.hide);
    return this.publish('hide');
  };

  Viewer.prototype.load = function(annotations) {
    var annotation, controller, controls, del, edit, element, field, item, link, links, list, _i, _j, _len, _len1, _ref, _ref1;
    this.annotations = annotations || [];
    list = this.element.find('ul:first').empty();
    _ref = this.annotations;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      annotation = _ref[_i];
      item = $(this.item).clone().appendTo(list).data('annotation', annotation);
      controls = item.find('.annotator-controls');
      link = controls.find('.annotator-link');
      edit = controls.find('.annotator-edit');
      del = controls.find('.annotator-delete');
      links = new LinkParser(annotation.links || []).get('alternate', {
        'type': 'text/html'
      });
      if (links.length === 0 || (links[0].href == null)) {
        link.remove();
      } else {
        link.attr('href', links[0].href);
      }
      if (this.options.readOnly) {
        edit.remove();
        del.remove();
      } else {
        controller = {
          showEdit: function() {
            return edit.removeAttr('disabled');
          },
          hideEdit: function() {
            return edit.attr('disabled', 'disabled');
          },
          showDelete: function() {
            return del.removeAttr('disabled');
          },
          hideDelete: function() {
            return del.attr('disabled', 'disabled');
          }
        };
      }
      _ref1 = this.fields;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        field = _ref1[_j];
        element = $(field.element).clone().appendTo(item)[0];
        field.load(element, annotation, controller);
      }
    }
    this.publish('load', [this.annotations]);
    return this.show();
  };

  Viewer.prototype.addField = function(options) {
    var field;
    field = $.extend({
      load: function() {}
    }, options);
    field.element = $('<div />')[0];
    this.fields.push(field);
    field.element;
    return this;
  };

  Viewer.prototype.onEditClick = function(event) {
    return this.onButtonClick(event, 'edit');
  };

  Viewer.prototype.onDeleteClick = function(event) {
    return this.onButtonClick(event, 'delete');
  };

  Viewer.prototype.onButtonClick = function(event, type) {
    var item;
    item = $(event.target).parents('.annotator-annotation');
    return this.publish(type, [item.data('annotation')]);
  };

  return Viewer;

})(Annotator.Widget);

LinkParser = (function() {
  function LinkParser(data) {
    this.data = data;
  }

  LinkParser.prototype.get = function(rel, cond) {
    var d, k, keys, match, v, _i, _len, _ref, _results;
    if (cond == null) {
      cond = {};
    }
    cond = $.extend({}, cond, {
      rel: rel
    });
    keys = (function() {
      var _results;
      _results = [];
      for (k in cond) {
        if (!__hasProp.call(cond, k)) continue;
        v = cond[k];
        _results.push(k);
      }
      return _results;
    })();
    _ref = this.data;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      d = _ref[_i];
      match = keys.reduce((function(m, k) {
        return m && (d[k] === cond[k]);
      }), true);
      if (match) {
        _results.push(d);
      } else {
        continue;
      }
    }
    return _results;
  };

  return LinkParser;

})();

//# sourceMappingURL=viewer.map
;// Generated by CoffeeScript 1.7.1
var Annotator,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Annotator = Annotator || {};

Annotator.Notification = (function(_super) {
  __extends(Notification, _super);

  Notification.prototype.events = {
    "click": "hide"
  };

  Notification.prototype.options = {
    html: "<div class='annotator-notice'></div>",
    classes: {
      show: "annotator-notice-show",
      info: "annotator-notice-info",
      success: "annotator-notice-success",
      error: "annotator-notice-error"
    }
  };

  function Notification(options) {
    this.hide = __bind(this.hide, this);
    this.show = __bind(this.show, this);
    Notification.__super__.constructor.call(this, $(this.options.html).appendTo(document.body)[0], options);
  }

  Notification.prototype.show = function(message, status) {
    if (status == null) {
      status = Annotator.Notification.INFO;
    }
    this.currentStatus = status;
    $(this.element).addClass(this.options.classes.show).addClass(this.options.classes[this.currentStatus]).html(Util.escape(message || ""));
    setTimeout(this.hide, 5000);
    return this;
  };

  Notification.prototype.hide = function() {
    if (this.currentStatus == null) {
      this.currentStatus = Annotator.Notification.INFO;
    }
    $(this.element).removeClass(this.options.classes.show).removeClass(this.options.classes[this.currentStatus]);
    return this;
  };

  return Notification;

})(Delegator);

Annotator.Notification.INFO = 'info';

Annotator.Notification.SUCCESS = 'success';

Annotator.Notification.ERROR = 'error';

$(function() {
  var notification;
  notification = new Annotator.Notification;
  Annotator.showNotification = notification.show;
  return Annotator.hideNotification = notification.hide;
});

//# sourceMappingURL=notification.map
;// Generated by CoffeeScript 1.7.1
var findChild, getNodeName, getNodePosition, simpleXPathJQuery, simpleXPathPure;

simpleXPathJQuery = function(relativeRoot) {
  var jq;
  jq = this.map(function() {
    var elem, idx, path, tagName;
    path = '';
    elem = this;
    while ((elem != null ? elem.nodeType : void 0) === Node.ELEMENT_NODE && elem !== relativeRoot) {
      tagName = elem.tagName.replace(":", "\\:");
      idx = $(elem.parentNode).children(tagName).index(elem) + 1;
      idx = "[" + idx + "]";
      path = "/" + elem.tagName.toLowerCase() + idx + path;
      elem = elem.parentNode;
    }
    return path;
  });
  return jq.get();
};

simpleXPathPure = function(relativeRoot) {
  var getPathSegment, getPathTo, jq, rootNode;
  getPathSegment = function(node) {
    var name, pos;
    name = getNodeName(node);
    pos = getNodePosition(node);
    return "" + name + "[" + pos + "]";
  };
  rootNode = relativeRoot;
  getPathTo = function(node) {
    var xpath;
    xpath = '';
    while (node !== rootNode) {
      if (node == null) {
        throw new Error("Called getPathTo on a node which was not a descendant of @rootNode. " + rootNode);
      }
      xpath = (getPathSegment(node)) + '/' + xpath;
      node = node.parentNode;
    }
    xpath = '/' + xpath;
    xpath = xpath.replace(/\/$/, '');
    return xpath;
  };
  jq = this.map(function() {
    var path;
    path = getPathTo(this);
    return path;
  });
  return jq.get();
};

findChild = function(node, type, index) {
  var child, children, found, name, _i, _len;
  if (!node.hasChildNodes()) {
    throw new Error("XPath error: node has no children!");
  }
  children = node.childNodes;
  found = 0;
  for (_i = 0, _len = children.length; _i < _len; _i++) {
    child = children[_i];
    name = getNodeName(child);
    if (name === type) {
      found += 1;
      if (found === index) {
        return child;
      }
    }
  }
  throw new Error("XPath error: wanted child not found.");
};

getNodeName = function(node) {
  var nodeName;
  nodeName = node.nodeName.toLowerCase();
  switch (nodeName) {
    case "#text":
      return "text()";
    case "#comment":
      return "comment()";
    case "#cdata-section":
      return "cdata-section()";
    default:
      return nodeName;
  }
};

getNodePosition = function(node) {
  var pos, tmp;
  pos = 0;
  tmp = node;
  while (tmp) {
    if (tmp.nodeName === node.nodeName) {
      pos++;
    }
    tmp = tmp.previousSibling;
  }
  return pos;
};

//# sourceMappingURL=xpath.map
;// Generated by CoffeeScript 1.7.1
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Annotator.Plugin.Store = (function(_super) {
  __extends(Store, _super);

  Store.prototype.events = {
    'annotationCreated': 'annotationCreated',
    'annotationDeleted': 'annotationDeleted',
    'annotationUpdated': 'annotationUpdated'
  };

  Store.prototype.options = {
    annotationData: {},
    emulateHTTP: false,
    loadFromSearch: false,
    prefix: '/store',
    urls: {
      create: '/annotations',
      read: '/annotations/:id',
      update: '/annotations/:id',
      destroy: '/annotations/:id',
      search: '/search'
    }
  };

  function Store(element, options) {
    this._onError = __bind(this._onError, this);
    this._onLoadAnnotationsFromSearch = __bind(this._onLoadAnnotationsFromSearch, this);
    this._onLoadAnnotations = __bind(this._onLoadAnnotations, this);
    this._getAnnotations = __bind(this._getAnnotations, this);
    Store.__super__.constructor.apply(this, arguments);
    this.annotations = [];
  }

  Store.prototype.pluginInit = function() {
    if (!Annotator.supported()) {
      return;
    }
    if (this.annotator.plugins.Auth) {
      return this.annotator.plugins.Auth.withToken(this._getAnnotations);
    } else {
      return this._getAnnotations();
    }
  };

  Store.prototype._getAnnotations = function() {
    if (this.options.loadFromSearch) {
      return this.loadAnnotationsFromSearch(this.options.loadFromSearch);
    } else {
      return this.loadAnnotations();
    }
  };

  Store.prototype.annotationCreated = function(annotation) {
    if (__indexOf.call(this.annotations, annotation) < 0) {
      this.registerAnnotation(annotation);
      return this._apiRequest('create', annotation, (function(_this) {
        return function(data) {
          if (data.id == null) {
            console.warn(Annotator._t("Warning: No ID returned from server for annotation "), annotation);
          }
          return _this.updateAnnotation(annotation, data);
        };
      })(this));
    } else {
      return this.updateAnnotation(annotation, {});
    }
  };

  Store.prototype.annotationUpdated = function(annotation) {
    if (__indexOf.call(this.annotations, annotation) >= 0) {
      return this._apiRequest('update', annotation, ((function(_this) {
        return function(data) {
          return _this.updateAnnotation(annotation, data);
        };
      })(this)));
    }
  };

  Store.prototype.annotationDeleted = function(annotation) {
    if (__indexOf.call(this.annotations, annotation) >= 0) {
      return this._apiRequest('destroy', annotation, ((function(_this) {
        return function() {
          return _this.unregisterAnnotation(annotation);
        };
      })(this)));
    }
  };

  Store.prototype.registerAnnotation = function(annotation) {
    return this.annotations.push(annotation);
  };

  Store.prototype.unregisterAnnotation = function(annotation) {
    return this.annotations.splice(this.annotations.indexOf(annotation), 1);
  };

  Store.prototype.updateAnnotation = function(annotation, data) {
    if (__indexOf.call(this.annotations, annotation) < 0) {
      console.error(Annotator._t("Trying to update unregistered annotation!"));
    } else {
      $.extend(annotation, data);
    }
    return $(annotation.highlights).data('annotation', annotation);
  };

  Store.prototype.loadAnnotations = function() {
    return this._apiRequest('read', null, this._onLoadAnnotations);
  };

  Store.prototype._onLoadAnnotations = function(data) {
    var a, annotation, annotationMap, newData, _i, _j, _len, _len1, _ref;
    if (data == null) {
      data = [];
    }
    annotationMap = {};
    _ref = this.annotations;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      a = _ref[_i];
      annotationMap[a.id] = a;
    }
    newData = [];
    for (_j = 0, _len1 = data.length; _j < _len1; _j++) {
      a = data[_j];
      if (annotationMap[a.id]) {
        annotation = annotationMap[a.id];
        this.updateAnnotation(annotation, a);
      } else {
        newData.push(a);
      }
    }
    this.annotations = this.annotations.concat(newData);
    return this.annotator.loadAnnotations(newData.slice());
  };

  Store.prototype.loadAnnotationsFromSearch = function(searchOptions) {
    return this._apiRequest('search', searchOptions, this._onLoadAnnotationsFromSearch);
  };

  Store.prototype._onLoadAnnotationsFromSearch = function(data) {
    if (data == null) {
      data = {};
    }
    return this._onLoadAnnotations(data.rows || []);
  };

  Store.prototype.dumpAnnotations = function() {
    var ann, _i, _len, _ref, _results;
    _ref = this.annotations;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      ann = _ref[_i];
      _results.push(JSON.parse(this._dataFor(ann)));
    }
    return _results;
  };

  Store.prototype._apiRequest = function(action, obj, onSuccess) {
    var id, options, request, url;
    id = obj && obj.id;
    url = this._urlFor(action, id);
    options = this._apiRequestOptions(action, obj, onSuccess);
    request = $.ajax(url, options);
    request._id = id;
    request._action = action;
    return request;
  };

  Store.prototype._apiRequestOptions = function(action, obj, onSuccess) {
    var data, method, opts;
    method = this._methodFor(action);
    opts = {
      type: method,
      headers: this.element.data('annotator:headers'),
      dataType: "json",
      success: onSuccess || function() {},
      error: this._onError
    };
    if (this.options.emulateHTTP && (method === 'PUT' || method === 'DELETE')) {
      opts.headers = $.extend(opts.headers, {
        'X-HTTP-Method-Override': method
      });
      opts.type = 'POST';
    }
    if (action === "search") {
      opts = $.extend(opts, {
        data: obj
      });
      return opts;
    }
    data = obj && this._dataFor(obj);
    if (this.options.emulateJSON) {
      opts.data = {
        json: data
      };
      if (this.options.emulateHTTP) {
        opts.data._method = method;
      }
      return opts;
    }
    opts = $.extend(opts, {
      data: data,
      contentType: "application/json; charset=utf-8"
    });
    return opts;
  };

  Store.prototype._urlFor = function(action, id) {
    var url;
    url = this.options.prefix != null ? this.options.prefix : '';
    url += this.options.urls[action];
    url = url.replace(/\/:id/, id != null ? '/' + id : '');
    url = url.replace(/:id/, id != null ? id : '');
    return url;
  };

  Store.prototype._methodFor = function(action) {
    var table;
    table = {
      'create': 'POST',
      'read': 'GET',
      'update': 'PUT',
      'destroy': 'DELETE',
      'search': 'GET'
    };
    return table[action];
  };

  Store.prototype._dataFor = function(annotation) {
    var data, highlights;
    highlights = annotation.highlights;
    delete annotation.highlights;
    $.extend(annotation, this.options.annotationData);
    data = JSON.stringify(annotation);
    if (highlights) {
      annotation.highlights = highlights;
    }
    return data;
  };

  Store.prototype._onError = function(xhr) {
    var action, message;
    action = xhr._action;
    message = Annotator._t("Sorry we could not ") + action + Annotator._t(" this annotation");
    if (xhr._action === 'search') {
      message = Annotator._t("Sorry we could not search the store for annotations");
    } else if (xhr._action === 'read' && !xhr._id) {
      message = Annotator._t("Sorry we could not ") + action + Annotator._t(" the annotations from the store");
    }
    switch (xhr.status) {
      case 401:
        message = Annotator._t("Sorry you are not allowed to ") + action + Annotator._t(" this annotation");
        break;
      case 404:
        message = Annotator._t("Sorry we could not connect to the annotations store");
        break;
      case 500:
        message = Annotator._t("Sorry something went wrong with the annotation store");
    }
    Annotator.showNotification(message, Annotator.Notification.ERROR);
    return console.error(Annotator._t("API request failed:") + (" '" + xhr.status + "'"));
  };

  return Store;

})(Annotator.Plugin);

//# sourceMappingURL=store.map
;// Generated by CoffeeScript 1.7.1
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Annotator.Plugin.Permissions = (function(_super) {
  __extends(Permissions, _super);

  Permissions.prototype.events = {
    'beforeAnnotationCreated': 'addFieldsToAnnotation'
  };

  Permissions.prototype.options = {
    showViewPermissionsCheckbox: true,
    showEditPermissionsCheckbox: true,
    userId: function(user) {
      return user;
    },
    userString: function(user) {
      return user;
    },
    userAuthorize: function(action, annotation, user) {
      var token, tokens, _i, _len;
      if (annotation.permissions) {
        tokens = annotation.permissions[action] || [];
        if (tokens.length === 0) {
          return true;
        }
        for (_i = 0, _len = tokens.length; _i < _len; _i++) {
          token = tokens[_i];
          if (this.userId(user) === token) {
            return true;
          }
        }
        return false;
      } else if (annotation.user) {
        if (user) {
          return this.userId(user) === this.userId(annotation.user);
        } else {
          return false;
        }
      }
      return true;
    },
    user: '',
    permissions: {
      'read': [],
      'update': [],
      'delete': [],
      'admin': []
    }
  };

  function Permissions(element, options) {
    this._setAuthFromToken = __bind(this._setAuthFromToken, this);
    this.updateViewer = __bind(this.updateViewer, this);
    this.updateAnnotationPermissions = __bind(this.updateAnnotationPermissions, this);
    this.updatePermissionsField = __bind(this.updatePermissionsField, this);
    this.addFieldsToAnnotation = __bind(this.addFieldsToAnnotation, this);
    Permissions.__super__.constructor.apply(this, arguments);
    if (this.options.user) {
      this.setUser(this.options.user);
      delete this.options.user;
    }
  }

  Permissions.prototype.pluginInit = function() {
    var createCallback, self;
    if (!Annotator.supported()) {
      return;
    }
    self = this;
    createCallback = function(method, type) {
      return function(field, annotation) {
        return self[method].call(self, type, field, annotation);
      };
    };
    if (!this.user && this.annotator.plugins.Auth) {
      this.annotator.plugins.Auth.withToken(this._setAuthFromToken);
    }
    if (this.options.showViewPermissionsCheckbox === true) {
      this.annotator.editor.addField({
        type: 'checkbox',
        label: Annotator._t('Allow anyone to <strong>view</strong> this annotation'),
        load: createCallback('updatePermissionsField', 'read'),
        submit: createCallback('updateAnnotationPermissions', 'read')
      });
    }
    if (this.options.showEditPermissionsCheckbox === true) {
      this.annotator.editor.addField({
        type: 'checkbox',
        label: Annotator._t('Allow anyone to <strong>edit</strong> this annotation'),
        load: createCallback('updatePermissionsField', 'update'),
        submit: createCallback('updateAnnotationPermissions', 'update')
      });
    }
    this.annotator.viewer.addField({
      load: this.updateViewer
    });
    if (this.annotator.plugins.Filter) {
      return this.annotator.plugins.Filter.addFilter({
        label: Annotator._t('User'),
        property: 'user',
        isFiltered: (function(_this) {
          return function(input, user) {
            var keyword, _i, _len, _ref;
            user = _this.options.userString(user);
            if (!(input && user)) {
              return false;
            }
            _ref = input.split(/\s*/);
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              keyword = _ref[_i];
              if (user.indexOf(keyword) === -1) {
                return false;
              }
            }
            return true;
          };
        })(this)
      });
    }
  };

  Permissions.prototype.setUser = function(user) {
    return this.user = user;
  };

  Permissions.prototype.addFieldsToAnnotation = function(annotation) {
    if (annotation) {
      annotation.permissions = $.extend(true, {}, this.options.permissions);
      if (this.user) {
        return annotation.user = this.user;
      }
    }
  };

  Permissions.prototype.authorize = function(action, annotation, user) {
    if (user === void 0) {
      user = this.user;
    }
    if (this.options.userAuthorize) {
      return this.options.userAuthorize.call(this.options, action, annotation, user);
    } else {
      return true;
    }
  };

  Permissions.prototype.updatePermissionsField = function(action, field, annotation) {
    var input;
    field = $(field).show();
    input = field.find('input').removeAttr('disabled');
    if (!this.authorize('admin', annotation)) {
      field.hide();
    }
    if (this.authorize(action, annotation || {}, null)) {
      return input.attr('checked', 'checked');
    } else {
      return input.removeAttr('checked');
    }
  };

  Permissions.prototype.updateAnnotationPermissions = function(type, field, annotation) {
    var dataKey;
    if (!annotation.permissions) {
      annotation.permissions = $.extend(true, {}, this.options.permissions);
    }
    dataKey = type + '-permissions';
    if ($(field).find('input').is(':checked')) {
      return annotation.permissions[type] = [];
    } else {
      return annotation.permissions[type] = [this.options.userId(this.user)];
    }
  };

  Permissions.prototype.updateViewer = function(field, annotation, controls) {
    var user, username;
    field = $(field);
    username = this.options.userString(annotation.user);
    if (annotation.user && username && typeof username === 'string') {
      user = Annotator.Util.escape(this.options.userString(annotation.user));
      field.html(user).addClass('annotator-user');
    } else {
      field.remove();
    }
    if (controls) {
      if (!this.authorize('update', annotation)) {
        controls.hideEdit();
      }
      if (!this.authorize('delete', annotation)) {
        return controls.hideDelete();
      }
    }
  };

  Permissions.prototype._setAuthFromToken = function(token) {
    return this.setUser(token.userId);
  };

  return Permissions;

})(Annotator.Plugin);

//# sourceMappingURL=permissions.map
;// Generated by CoffeeScript 1.7.1
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Annotator.Plugin.AnnotateItPermissions = (function(_super) {
  __extends(AnnotateItPermissions, _super);

  function AnnotateItPermissions() {
    this._setAuthFromToken = __bind(this._setAuthFromToken, this);
    this.updateAnnotationPermissions = __bind(this.updateAnnotationPermissions, this);
    this.updatePermissionsField = __bind(this.updatePermissionsField, this);
    this.addFieldsToAnnotation = __bind(this.addFieldsToAnnotation, this);
    return AnnotateItPermissions.__super__.constructor.apply(this, arguments);
  }

  AnnotateItPermissions.prototype.options = {
    showViewPermissionsCheckbox: true,
    showEditPermissionsCheckbox: true,
    groups: {
      world: 'group:__world__',
      authenticated: 'group:__authenticated__',
      consumer: 'group:__consumer__'
    },
    userId: function(user) {
      return user.userId;
    },
    userString: function(user) {
      return user.userId;
    },
    userAuthorize: function(action, annotation, user) {
      var action_field, permissions, _ref, _ref1, _ref2, _ref3;
      permissions = annotation.permissions || {};
      action_field = permissions[action] || [];
      if (_ref = this.groups.world, __indexOf.call(action_field, _ref) >= 0) {
        return true;
      } else if ((user != null) && (user.userId != null) && (user.consumerKey != null)) {
        if (user.userId === annotation.user && user.consumerKey === annotation.consumer) {
          return true;
        } else if (_ref1 = this.groups.authenticated, __indexOf.call(action_field, _ref1) >= 0) {
          return true;
        } else if (user.consumerKey === annotation.consumer && (_ref2 = this.groups.consumer, __indexOf.call(action_field, _ref2) >= 0)) {
          return true;
        } else if (user.consumerKey === annotation.consumer && (_ref3 = user.userId, __indexOf.call(action_field, _ref3) >= 0)) {
          return true;
        } else if (user.consumerKey === annotation.consumer && user.admin) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    permissions: {
      'read': ['group:__world__'],
      'update': [],
      'delete': [],
      'admin': []
    }
  };

  AnnotateItPermissions.prototype.addFieldsToAnnotation = function(annotation) {
    if (annotation) {
      annotation.permissions = this.options.permissions;
      if (this.user) {
        annotation.user = this.user.userId;
        return annotation.consumer = this.user.consumerKey;
      }
    }
  };

  AnnotateItPermissions.prototype.updatePermissionsField = function(action, field, annotation) {
    var input;
    field = $(field).show();
    input = field.find('input').removeAttr('disabled');
    if (!this.authorize('admin', annotation)) {
      field.hide();
    }
    if (this.user && this.authorize(action, annotation || {}, {
      userId: '__nonexistentuser__',
      consumerKey: this.user.consumerKey
    })) {
      return input.attr('checked', 'checked');
    } else {
      return input.removeAttr('checked');
    }
  };

  AnnotateItPermissions.prototype.updateAnnotationPermissions = function(type, field, annotation) {
    var dataKey;
    if (!annotation.permissions) {
      annotation.permissions = this.options.permissions;
    }
    dataKey = type + '-permissions';
    if ($(field).find('input').is(':checked')) {
      return annotation.permissions[type] = [type === 'read' ? this.options.groups.world : this.options.groups.consumer];
    } else {
      return annotation.permissions[type] = [];
    }
  };

  AnnotateItPermissions.prototype._setAuthFromToken = function(token) {
    return this.setUser(token);
  };

  return AnnotateItPermissions;

})(Annotator.Plugin.Permissions);

//# sourceMappingURL=annotateitpermissions.map
;// Generated by CoffeeScript 1.7.1
var base64Decode, base64UrlDecode, createDateFromISO8601, parseToken,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

createDateFromISO8601 = function(string) {
  var d, date, offset, regexp, time, _ref;
  regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" + "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\\.([0-9]+))?)?" + "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
  d = string.match(new RegExp(regexp));
  offset = 0;
  date = new Date(d[1], 0, 1);
  if (d[3]) {
    date.setMonth(d[3] - 1);
  }
  if (d[5]) {
    date.setDate(d[5]);
  }
  if (d[7]) {
    date.setHours(d[7]);
  }
  if (d[8]) {
    date.setMinutes(d[8]);
  }
  if (d[10]) {
    date.setSeconds(d[10]);
  }
  if (d[12]) {
    date.setMilliseconds(Number("0." + d[12]) * 1000);
  }
  if (d[14]) {
    offset = (Number(d[16]) * 60) + Number(d[17]);
    offset *= (_ref = d[15] === '-') != null ? _ref : {
      1: -1
    };
  }
  offset -= date.getTimezoneOffset();
  time = Number(date) + (offset * 60 * 1000);
  date.setTime(Number(time));
  return date;
};

base64Decode = function(data) {
  var ac, b64, bits, dec, h1, h2, h3, h4, i, o1, o2, o3, tmp_arr;
  if (typeof atob !== "undefined" && atob !== null) {
    return atob(data);
  } else {
    b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    i = 0;
    ac = 0;
    dec = "";
    tmp_arr = [];
    if (!data) {
      return data;
    }
    data += '';
    while (i < data.length) {
      h1 = b64.indexOf(data.charAt(i++));
      h2 = b64.indexOf(data.charAt(i++));
      h3 = b64.indexOf(data.charAt(i++));
      h4 = b64.indexOf(data.charAt(i++));
      bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
      o1 = bits >> 16 & 0xff;
      o2 = bits >> 8 & 0xff;
      o3 = bits & 0xff;
      if (h3 === 64) {
        tmp_arr[ac++] = String.fromCharCode(o1);
      } else if (h4 === 64) {
        tmp_arr[ac++] = String.fromCharCode(o1, o2);
      } else {
        tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
      }
    }
    return tmp_arr.join('');
  }
};

base64UrlDecode = function(data) {
  var i, m, _i, _ref;
  m = data.length % 4;
  if (m !== 0) {
    for (i = _i = 0, _ref = 4 - m; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      data += '=';
    }
  }
  data = data.replace(/-/g, '+');
  data = data.replace(/_/g, '/');
  return base64Decode(data);
};

parseToken = function(token) {
  var head, payload, sig, _ref;
  _ref = token.split('.'), head = _ref[0], payload = _ref[1], sig = _ref[2];
  return JSON.parse(base64UrlDecode(payload));
};

Annotator.Plugin.Auth = (function(_super) {
  __extends(Auth, _super);

  Auth.prototype.options = {
    token: null,
    tokenUrl: '/auth/token',
    autoFetch: true
  };

  function Auth(element, options) {
    Auth.__super__.constructor.apply(this, arguments);
    this.waitingForToken = [];
    if (this.options.token) {
      this.setToken(this.options.token);
    } else {
      this.requestToken();
    }
  }

  Auth.prototype.requestToken = function() {
    this.requestInProgress = true;
    return $.ajax({
      url: this.options.tokenUrl,
      dataType: 'text',
      xhrFields: {
        withCredentials: true
      }
    }).done((function(_this) {
      return function(data, status, xhr) {
        return _this.setToken(data);
      };
    })(this)).fail((function(_this) {
      return function(xhr, status, err) {
        var msg;
        msg = Annotator._t("Couldn't get auth token:");
        console.error("" + msg + " " + err, xhr);
        return Annotator.showNotification("" + msg + " " + xhr.responseText, Annotator.Notification.ERROR);
      };
    })(this)).always((function(_this) {
      return function() {
        return _this.requestInProgress = false;
      };
    })(this));
  };

  Auth.prototype.setToken = function(token) {
    var _results;
    this.token = token;
    this._unsafeToken = parseToken(token);
    if (this.haveValidToken()) {
      if (this.options.autoFetch) {
        this.refreshTimeout = setTimeout(((function(_this) {
          return function() {
            return _this.requestToken();
          };
        })(this)), (this.timeToExpiry() - 2) * 1000);
      }
      this.updateHeaders();
      _results = [];
      while (this.waitingForToken.length > 0) {
        _results.push(this.waitingForToken.pop()(this._unsafeToken));
      }
      return _results;
    } else {
      console.warn(Annotator._t("Didn't get a valid token."));
      if (this.options.autoFetch) {
        console.warn(Annotator._t("Getting a new token in 10s."));
        return setTimeout(((function(_this) {
          return function() {
            return _this.requestToken();
          };
        })(this)), 10 * 1000);
      }
    }
  };

  Auth.prototype.haveValidToken = function() {
    var allFields;
    allFields = this._unsafeToken && this._unsafeToken.issuedAt && this._unsafeToken.ttl && this._unsafeToken.consumerKey;
    if (allFields && this.timeToExpiry() > 0) {
      return true;
    } else {
      return false;
    }
  };

  Auth.prototype.timeToExpiry = function() {
    var expiry, issue, now, timeToExpiry;
    now = new Date().getTime() / 1000;
    issue = createDateFromISO8601(this._unsafeToken.issuedAt).getTime() / 1000;
    expiry = issue + this._unsafeToken.ttl;
    timeToExpiry = expiry - now;
    if (timeToExpiry > 0) {
      return timeToExpiry;
    } else {
      return 0;
    }
  };

  Auth.prototype.updateHeaders = function() {
    var current;
    current = this.element.data('annotator:headers');
    return this.element.data('annotator:headers', $.extend(current, {
      'x-annotator-auth-token': this.token
    }));
  };

  Auth.prototype.withToken = function(callback) {
    if (callback == null) {
      return;
    }
    if (this.haveValidToken()) {
      return callback(this._unsafeToken);
    } else {
      this.waitingForToken.push(callback);
      if (!this.requestInProgress) {
        return this.requestToken();
      }
    }
  };

  return Auth;

})(Annotator.Plugin);

//# sourceMappingURL=auth.map
;// Generated by CoffeeScript 1.7.1
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Annotator.Plugin.Tags = (function(_super) {
  __extends(Tags, _super);

  function Tags() {
    this.setAnnotationTags = __bind(this.setAnnotationTags, this);
    this.updateField = __bind(this.updateField, this);
    return Tags.__super__.constructor.apply(this, arguments);
  }

  Tags.prototype.options = {
    parseTags: function(string) {
      var tags;
      string = $.trim(string);
      tags = [];
      if (string) {
        tags = string.split(/\s+/);
      }
      return tags;
    },
    stringifyTags: function(array) {
      return array.join(" ");
    }
  };

  Tags.prototype.field = null;

  Tags.prototype.input = null;

  Tags.prototype.pluginInit = function() {
    if (!Annotator.supported()) {
      return;
    }
    this.field = this.annotator.editor.addField({
      label: Annotator._t('Add some tags here') + '\u2026',
      load: this.updateField,
      submit: this.setAnnotationTags
    });
    this.annotator.viewer.addField({
      load: this.updateViewer
    });
    if (this.annotator.plugins.Filter) {
      this.annotator.plugins.Filter.addFilter({
        label: Annotator._t('Tag'),
        property: 'tags',
        isFiltered: Annotator.Plugin.Tags.filterCallback
      });
    }
    return this.input = $(this.field).find(':input');
  };

  Tags.prototype.parseTags = function(string) {
    return this.options.parseTags(string);
  };

  Tags.prototype.stringifyTags = function(array) {
    return this.options.stringifyTags(array);
  };

  Tags.prototype.updateField = function(field, annotation) {
    var value;
    value = '';
    if (annotation.tags) {
      value = this.stringifyTags(annotation.tags);
    }
    return this.input.val(value);
  };

  Tags.prototype.setAnnotationTags = function(field, annotation) {
    return annotation.tags = this.parseTags(this.input.val());
  };

  Tags.prototype.updateViewer = function(field, annotation) {
    field = $(field);
    if (annotation.tags && $.isArray(annotation.tags) && annotation.tags.length) {
      return field.addClass('annotator-tags').html(function() {
        var string;
        return string = $.map(annotation.tags, function(tag) {
          return '<span class="annotator-tag">' + Annotator.Util.escape(tag) + '</span>';
        }).join(' ');
      });
    } else {
      return field.remove();
    }
  };

  return Tags;

})(Annotator.Plugin);

Annotator.Plugin.Tags.filterCallback = function(input, tags) {
  var keyword, keywords, matches, tag, _i, _j, _len, _len1;
  if (tags == null) {
    tags = [];
  }
  matches = 0;
  keywords = [];
  if (input) {
    keywords = input.split(/\s+/g);
    for (_i = 0, _len = keywords.length; _i < _len; _i++) {
      keyword = keywords[_i];
      if (tags.length) {
        for (_j = 0, _len1 = tags.length; _j < _len1; _j++) {
          tag = tags[_j];
          if (tag.indexOf(keyword) !== -1) {
            matches += 1;
          }
        }
      }
    }
  }
  return matches === keywords.length;
};

//# sourceMappingURL=tags.map
;// Generated by CoffeeScript 1.7.1
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Annotator.Plugin.Unsupported = (function(_super) {
  __extends(Unsupported, _super);

  function Unsupported() {
    return Unsupported.__super__.constructor.apply(this, arguments);
  }

  Unsupported.prototype.options = {
    message: Annotator._t("Sorry your current browser does not support the Annotator")
  };

  Unsupported.prototype.pluginInit = function() {
    if (!Annotator.supported()) {
      return $((function(_this) {
        return function() {
          Annotator.showNotification(_this.options.message);
          if ((window.XMLHttpRequest === void 0) && (ActiveXObject !== void 0)) {
            return $('html').addClass('ie6');
          }
        };
      })(this));
    }
  };

  return Unsupported;

})(Annotator.Plugin);

//# sourceMappingURL=unsupported.map
;// Generated by CoffeeScript 1.7.1
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Annotator.Plugin.Filter = (function(_super) {
  __extends(Filter, _super);

  Filter.prototype.events = {
    ".annotator-filter-property input focus": "_onFilterFocus",
    ".annotator-filter-property input blur": "_onFilterBlur",
    ".annotator-filter-property input keyup": "_onFilterKeyup",
    ".annotator-filter-previous click": "_onPreviousClick",
    ".annotator-filter-next click": "_onNextClick",
    ".annotator-filter-clear click": "_onClearClick"
  };

  Filter.prototype.classes = {
    active: 'annotator-filter-active',
    hl: {
      hide: 'annotator-hl-filtered',
      active: 'annotator-hl-active'
    }
  };

  Filter.prototype.html = {
    element: "<div class=\"annotator-filter\">\n  <strong>" + Annotator._t('Navigate:') + "</strong>\n<span class=\"annotator-filter-navigation\">\n  <button class=\"annotator-filter-previous\">" + Annotator._t('Previous') + "</button>\n<button class=\"annotator-filter-next\">" + Annotator._t('Next') + "</button>\n</span>\n<strong>" + Annotator._t('Filter by:') + "</strong>\n</div>",
    filter: "<span class=\"annotator-filter-property\">\n  <label></label>\n  <input/>\n  <button class=\"annotator-filter-clear\">" + Annotator._t('Clear') + "</button>\n</span>"
  };

  Filter.prototype.options = {
    appendTo: 'body',
    filters: [],
    addAnnotationFilter: true,
    isFiltered: function(input, property) {
      var keyword, _i, _len, _ref;
      if (!(input && property)) {
        return false;
      }
      _ref = input.split(/\s+/);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        keyword = _ref[_i];
        if (property.indexOf(keyword) === -1) {
          return false;
        }
      }
      return true;
    }
  };

  function Filter(element, options) {
    this._onPreviousClick = __bind(this._onPreviousClick, this);
    this._onNextClick = __bind(this._onNextClick, this);
    this._onFilterKeyup = __bind(this._onFilterKeyup, this);
    this._onFilterBlur = __bind(this._onFilterBlur, this);
    this._onFilterFocus = __bind(this._onFilterFocus, this);
    this.updateHighlights = __bind(this.updateHighlights, this);
    var _base;
    element = $(this.html.element).appendTo((options != null ? options.appendTo : void 0) || this.options.appendTo);
    Filter.__super__.constructor.call(this, element, options);
    (_base = this.options).filters || (_base.filters = []);
    this.filter = $(this.html.filter);
    this.filters = [];
    this.current = 0;
  }

  Filter.prototype.pluginInit = function() {
    var filter, _i, _len, _ref;
    _ref = this.options.filters;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      filter = _ref[_i];
      this.addFilter(filter);
    }
    this.updateHighlights();
    this._setupListeners()._insertSpacer();
    if (this.options.addAnnotationFilter === true) {
      return this.addFilter({
        label: Annotator._t('Annotation'),
        property: 'text'
      });
    }
  };

  Filter.prototype.destroy = function() {
    var currentMargin, html;
    Filter.__super__.destroy.apply(this, arguments);
    html = $('html');
    currentMargin = parseInt(html.css('padding-top'), 10) || 0;
    html.css('padding-top', currentMargin - this.element.outerHeight());
    return this.element.remove();
  };

  Filter.prototype._insertSpacer = function() {
    var currentMargin, html;
    html = $('html');
    currentMargin = parseInt(html.css('padding-top'), 10) || 0;
    html.css('padding-top', currentMargin + this.element.outerHeight());
    return this;
  };

  Filter.prototype._setupListeners = function() {
    var event, events, _i, _len;
    events = ['annotationsLoaded', 'annotationCreated', 'annotationUpdated', 'annotationDeleted'];
    for (_i = 0, _len = events.length; _i < _len; _i++) {
      event = events[_i];
      this.annotator.subscribe(event, this.updateHighlights);
    }
    return this;
  };

  Filter.prototype.addFilter = function(options) {
    var f, filter;
    filter = $.extend({
      label: '',
      property: '',
      isFiltered: this.options.isFiltered
    }, options);
    if (!((function() {
      var _i, _len, _ref, _results;
      _ref = this.filters;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        f = _ref[_i];
        if (f.property === filter.property) {
          _results.push(f);
        }
      }
      return _results;
    }).call(this)).length) {
      filter.id = 'annotator-filter-' + filter.property;
      filter.annotations = [];
      filter.element = this.filter.clone().appendTo(this.element);
      filter.element.find('label').html(filter.label).attr('for', filter.id);
      filter.element.find('input').attr({
        id: filter.id,
        placeholder: Annotator._t('Filter by ') + filter.label + '\u2026'
      });
      filter.element.find('button').hide();
      filter.element.data('filter', filter);
      this.filters.push(filter);
    }
    return this;
  };

  Filter.prototype.updateFilter = function(filter) {
    var annotation, annotations, input, property, _i, _len, _ref;
    filter.annotations = [];
    this.updateHighlights();
    this.resetHighlights();
    input = $.trim(filter.element.find('input').val());
    if (input) {
      annotations = this.highlights.map(function() {
        return $(this).data('annotation');
      });
      _ref = $.makeArray(annotations);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        annotation = _ref[_i];
        property = annotation[filter.property];
        if (filter.isFiltered(input, property)) {
          filter.annotations.push(annotation);
        }
      }
      return this.filterHighlights();
    }
  };

  Filter.prototype.updateHighlights = function() {
    this.highlights = this.annotator.element.find('.annotator-hl:visible');
    return this.filtered = this.highlights.not(this.classes.hl.hide);
  };

  Filter.prototype.filterHighlights = function() {
    var activeFilters, annotation, annotations, filtered, highlights, index, uniques, _i, _len, _ref;
    activeFilters = $.grep(this.filters, function(filter) {
      return !!filter.annotations.length;
    });
    filtered = ((_ref = activeFilters[0]) != null ? _ref.annotations : void 0) || [];
    if (activeFilters.length > 1) {
      annotations = [];
      $.each(activeFilters, function() {
        return $.merge(annotations, this.annotations);
      });
      uniques = [];
      filtered = [];
      $.each(annotations, function() {
        if ($.inArray(this, uniques) === -1) {
          return uniques.push(this);
        } else {
          return filtered.push(this);
        }
      });
    }
    highlights = this.highlights;
    for (index = _i = 0, _len = filtered.length; _i < _len; index = ++_i) {
      annotation = filtered[index];
      highlights = highlights.not(annotation.highlights);
    }
    highlights.addClass(this.classes.hl.hide);
    this.filtered = this.highlights.not(this.classes.hl.hide);
    return this;
  };

  Filter.prototype.resetHighlights = function() {
    this.highlights.removeClass(this.classes.hl.hide);
    this.filtered = this.highlights;
    return this;
  };

  Filter.prototype._onFilterFocus = function(event) {
    var input;
    input = $(event.target);
    input.parent().addClass(this.classes.active);
    return input.next('button').show();
  };

  Filter.prototype._onFilterBlur = function(event) {
    var input;
    if (!event.target.value) {
      input = $(event.target);
      input.parent().removeClass(this.classes.active);
      return input.next('button').hide();
    }
  };

  Filter.prototype._onFilterKeyup = function(event) {
    var filter;
    filter = $(event.target).parent().data('filter');
    if (filter) {
      return this.updateFilter(filter);
    }
  };

  Filter.prototype._findNextHighlight = function(previous) {
    var active, annotation, current, index, next, offset, operator, resetOffset;
    if (!this.highlights.length) {
      return this;
    }
    offset = previous ? 0 : -1;
    resetOffset = previous ? -1 : 0;
    operator = previous ? 'lt' : 'gt';
    active = this.highlights.not('.' + this.classes.hl.hide);
    current = active.filter('.' + this.classes.hl.active);
    if (!current.length) {
      current = active.eq(offset);
    }
    annotation = current.data('annotation');
    index = active.index(current[0]);
    next = active.filter(":" + operator + "(" + index + ")").not(annotation.highlights).eq(resetOffset);
    if (!next.length) {
      next = active.eq(resetOffset);
    }
    return this._scrollToHighlight(next.data('annotation').highlights);
  };

  Filter.prototype._onNextClick = function(event) {
    return this._findNextHighlight();
  };

  Filter.prototype._onPreviousClick = function(event) {
    return this._findNextHighlight(true);
  };

  Filter.prototype._scrollToHighlight = function(highlight) {
    highlight = $(highlight);
    this.highlights.removeClass(this.classes.hl.active);
    highlight.addClass(this.classes.hl.active);
    return $('html, body').animate({
      scrollTop: highlight.offset().top - (this.element.height() + 20)
    }, 150);
  };

  Filter.prototype._onClearClick = function(event) {
    return $(event.target).prev('input').val('').keyup().blur();
  };

  return Filter;

})(Annotator.Plugin);

//# sourceMappingURL=filter.map
