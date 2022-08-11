"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Header = void 0;
const react_1 = __importDefault(require("react"));
console.debug('[React]', react_1.default);
const react_dom_1 = __importDefault(require("react-dom"));
console.debug('[ReactDOM]', react_dom_1.default);
$('#selector').on('switch', function setHeaderLinks(ev, { token }) {
    $('#menu>a').each((_, a) => {
        const href = $(a).attr('href');
        if (href)
            $(a).attr('href', href.replace(/token=([A-Z]+)/, `token=${token}`));
    });
});
class Header extends react_1.default.Component {
    render() {
        return <header />;
    }
}
exports.Header = Header;
exports.default = Header;
//# sourceMappingURL=header.jsx.map