import {
  ObservableMap,
  action,
  apiDefineProperty,
  computed,
  createAtom,
  entries,
  getAdministration,
  getAtom,
  getGlobalState,
  intercept,
  interceptReads,
  isComputedProp,
  isObservableArray,
  isObservableObject,
  isObservableProp,
  makeObservable,
  observable,
  observe,
  reaction,
  runInAction,
  set,
  values,
  when
} from "./chunk-NVHOWBW2.js";
import "./chunk-BUSYA2B4.js";

// ../node_modules/mobx-state-tree/dist/mobx-state-tree.module.js
var livelinessChecking = "warn";
function setLivelinessChecking(mode) {
  livelinessChecking = mode;
}
function getLivelinessChecking() {
  return livelinessChecking;
}
function setLivelynessChecking(mode) {
  setLivelinessChecking(mode);
}
var Hook;
(function(Hook2) {
  Hook2["afterCreate"] = "afterCreate";
  Hook2["afterAttach"] = "afterAttach";
  Hook2["afterCreationFinalization"] = "afterCreationFinalization";
  Hook2["beforeDetach"] = "beforeDetach";
  Hook2["beforeDestroy"] = "beforeDestroy";
})(Hook || (Hook = {}));
var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
    d2.__proto__ = b2;
  } || function(d2, b2) {
    for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
  };
  return extendStatics(d, b);
};
function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
    throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var __assign = function() {
  __assign = Object.assign || function __assign2(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
}
function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() {
    if (t[0] & 1) throw t[1];
    return t[1];
  }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
    return this;
  }), g;
  function verb(n) {
    return function(v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return { value: op[1], done: false };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
}
function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function() {
      if (o && i >= o.length) o = void 0;
      return { value: o && o[i++], done: !o };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
}
function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}
function getType(object) {
  assertIsStateTreeNode(object, 1);
  return getStateTreeNode(object).type;
}
function getChildType(object, propertyName) {
  assertIsStateTreeNode(object, 1);
  return getStateTreeNode(object).getChildType(propertyName);
}
function onPatch(target, callback) {
  assertIsStateTreeNode(target, 1);
  assertIsFunction(callback, 2);
  return getStateTreeNode(target).onPatch(callback);
}
function onSnapshot(target, callback) {
  assertIsStateTreeNode(target, 1);
  assertIsFunction(callback, 2);
  return getStateTreeNode(target).onSnapshot(callback);
}
function applyPatch(target, patch) {
  assertIsStateTreeNode(target, 1);
  assertArg(patch, function(p) {
    return typeof p === "object";
  }, "object or array", 2);
  getStateTreeNode(target).applyPatches(asArray(patch));
}
function recordPatches(subject, filter) {
  assertIsStateTreeNode(subject, 1);
  var data = {
    patches: [],
    inversePatches: []
  };
  var publicData = {};
  var disposer;
  var recorder = {
    get recording() {
      return !!disposer;
    },
    get patches() {
      if (!publicData.patches) {
        publicData.patches = data.patches.slice();
      }
      return publicData.patches;
    },
    get reversedInversePatches() {
      if (!publicData.reversedInversePatches) {
        publicData.reversedInversePatches = data.inversePatches.slice().reverse();
      }
      return publicData.reversedInversePatches;
    },
    get inversePatches() {
      if (!publicData.inversePatches) {
        publicData.inversePatches = data.inversePatches.slice();
      }
      return publicData.inversePatches;
    },
    stop: function() {
      if (disposer) {
        disposer();
        disposer = void 0;
      }
    },
    resume: function() {
      if (disposer)
        return;
      disposer = onPatch(subject, function(patch, inversePatch) {
        if (filter && !filter(patch, inversePatch, getRunningActionContext())) {
          return;
        }
        data.patches.push(patch);
        data.inversePatches.push(inversePatch);
        publicData.patches = void 0;
        publicData.inversePatches = void 0;
        publicData.reversedInversePatches = void 0;
      });
    },
    replay: function(target) {
      applyPatch(target || subject, data.patches);
    },
    undo: function(target) {
      applyPatch(target || subject, data.inversePatches.slice().reverse());
    }
  };
  recorder.resume();
  return recorder;
}
function protect(target) {
  assertIsStateTreeNode(target, 1);
  var node = getStateTreeNode(target);
  if (!node.isRoot)
    throw new MstError("`protect` can only be invoked on root nodes");
  node.isProtectionEnabled = true;
}
function unprotect(target) {
  assertIsStateTreeNode(target, 1);
  var node = getStateTreeNode(target);
  if (!node.isRoot)
    throw new MstError("`unprotect` can only be invoked on root nodes");
  node.isProtectionEnabled = false;
}
function isProtected(target) {
  return getStateTreeNode(target).isProtected;
}
function applySnapshot(target, snapshot) {
  assertIsStateTreeNode(target, 1);
  return getStateTreeNode(target).applySnapshot(snapshot);
}
function getSnapshot(target, applyPostProcess) {
  if (applyPostProcess === void 0) {
    applyPostProcess = true;
  }
  assertIsStateTreeNode(target, 1);
  var node = getStateTreeNode(target);
  if (applyPostProcess)
    return node.snapshot;
  return freeze(node.type.getSnapshot(node, false));
}
function hasParent(target, depth) {
  if (depth === void 0) {
    depth = 1;
  }
  assertIsStateTreeNode(target, 1);
  assertIsNumber(depth, 2, 0);
  var parent = getStateTreeNode(target).parent;
  while (parent) {
    if (--depth === 0)
      return true;
    parent = parent.parent;
  }
  return false;
}
function getParent(target, depth) {
  if (depth === void 0) {
    depth = 1;
  }
  assertIsStateTreeNode(target, 1);
  assertIsNumber(depth, 2, 0);
  var d = depth;
  var parent = getStateTreeNode(target).parent;
  while (parent) {
    if (--d === 0)
      return parent.storedValue;
    parent = parent.parent;
  }
  throw new MstError("Failed to find the parent of ".concat(getStateTreeNode(target), " at depth ").concat(depth));
}
function hasParentOfType(target, type) {
  assertIsStateTreeNode(target, 1);
  assertIsType(type, 2);
  var parent = getStateTreeNode(target).parent;
  while (parent) {
    if (type.is(parent.storedValue))
      return true;
    parent = parent.parent;
  }
  return false;
}
function getParentOfType(target, type) {
  assertIsStateTreeNode(target, 1);
  assertIsType(type, 2);
  var parent = getStateTreeNode(target).parent;
  while (parent) {
    if (type.is(parent.storedValue))
      return parent.storedValue;
    parent = parent.parent;
  }
  throw new MstError("Failed to find the parent of ".concat(getStateTreeNode(target), " of a given type"));
}
function getRoot(target) {
  assertIsStateTreeNode(target, 1);
  return getStateTreeNode(target).root.storedValue;
}
function getPath(target) {
  assertIsStateTreeNode(target, 1);
  return getStateTreeNode(target).path;
}
function getPathParts(target) {
  assertIsStateTreeNode(target, 1);
  return splitJsonPath(getStateTreeNode(target).path);
}
function isRoot(target) {
  assertIsStateTreeNode(target, 1);
  return getStateTreeNode(target).isRoot;
}
function resolvePath(target, path) {
  assertIsStateTreeNode(target, 1);
  assertIsString(path, 2);
  var node = resolveNodeByPath(getStateTreeNode(target), path);
  return node ? node.value : void 0;
}
function resolveIdentifier(type, target, identifier2) {
  assertIsType(type, 1);
  assertIsStateTreeNode(target, 2);
  assertIsValidIdentifier(identifier2, 3);
  var node = getStateTreeNode(target).root.identifierCache.resolve(type, normalizeIdentifier(identifier2));
  return node === null || node === void 0 ? void 0 : node.value;
}
function getIdentifier(target) {
  assertIsStateTreeNode(target, 1);
  return getStateTreeNode(target).identifier;
}
function tryReference(getter, checkIfAlive) {
  if (checkIfAlive === void 0) {
    checkIfAlive = true;
  }
  try {
    var node = getter();
    if (node === void 0 || node === null) {
      return void 0;
    } else if (isStateTreeNode(node)) {
      if (!checkIfAlive) {
        return node;
      } else {
        return isAlive(node) ? node : void 0;
      }
    } else {
      throw new MstError("The reference to be checked is not one of node, null or undefined");
    }
  } catch (e) {
    if (e instanceof InvalidReferenceError) {
      return void 0;
    }
    throw e;
  }
}
function isValidReference(getter, checkIfAlive) {
  if (checkIfAlive === void 0) {
    checkIfAlive = true;
  }
  try {
    var node = getter();
    if (node === void 0 || node === null) {
      return false;
    } else if (isStateTreeNode(node)) {
      return checkIfAlive ? isAlive(node) : true;
    } else {
      throw new MstError("The reference to be checked is not one of node, null or undefined");
    }
  } catch (e) {
    if (e instanceof InvalidReferenceError) {
      return false;
    }
    throw e;
  }
}
function tryResolve(target, path) {
  assertIsStateTreeNode(target, 1);
  assertIsString(path, 2);
  var node = resolveNodeByPath(getStateTreeNode(target), path, false);
  if (node === void 0)
    return void 0;
  try {
    return node.value;
  } catch (e) {
    return void 0;
  }
}
function getRelativePath(base, target) {
  assertIsStateTreeNode(base, 1);
  assertIsStateTreeNode(target, 2);
  return getRelativePathBetweenNodes(getStateTreeNode(base), getStateTreeNode(target));
}
function clone(source, keepEnvironment) {
  if (keepEnvironment === void 0) {
    keepEnvironment = true;
  }
  assertIsStateTreeNode(source, 1);
  var node = getStateTreeNode(source);
  return node.type.create(node.snapshot, keepEnvironment === true ? node.root.environment : keepEnvironment === false ? void 0 : keepEnvironment);
}
function detach(target) {
  assertIsStateTreeNode(target, 1);
  getStateTreeNode(target).detach();
  return target;
}
function destroy(target) {
  assertIsStateTreeNode(target, 1);
  var node = getStateTreeNode(target);
  if (node.isRoot)
    node.die();
  else
    node.parent.removeChild(node.subpath);
}
function isAlive(target) {
  assertIsStateTreeNode(target, 1);
  return getStateTreeNode(target).observableIsAlive;
}
function addDisposer(target, disposer) {
  assertIsStateTreeNode(target, 1);
  assertIsFunction(disposer, 2);
  var node = getStateTreeNode(target);
  node.addDisposer(disposer);
  return disposer;
}
function getEnv(target) {
  assertIsStateTreeNode(target, 1);
  var node = getStateTreeNode(target);
  var env = node.root.environment;
  if (!env)
    throw new MstError("Failed to find the environment of ".concat(node, " ").concat(node.path));
  return env;
}
function hasEnv(target) {
  if (true) {
    if (!isStateTreeNode(target))
      throw new MstError("expected first argument to be a mobx-state-tree node, got " + target + " instead");
  }
  var node = getStateTreeNode(target);
  var env = node.root.environment;
  return !!env;
}
function walk(target, processor) {
  assertIsStateTreeNode(target, 1);
  assertIsFunction(processor, 2);
  var node = getStateTreeNode(target);
  node.getChildren().forEach(function(child) {
    if (isStateTreeNode(child.storedValue))
      walk(child.storedValue, processor);
  });
  processor(node.storedValue);
}
function getPropertyMembers(typeOrNode) {
  var type;
  if (isStateTreeNode(typeOrNode)) {
    type = getType(typeOrNode);
  } else {
    type = typeOrNode;
  }
  assertArg(type, function(t) {
    return isModelType(t);
  }, "model type or model instance", 1);
  return {
    name: type.name,
    properties: __assign({}, type.properties)
  };
}
function getMembers(target) {
  var type = getStateTreeNode(target).type;
  var reflected = __assign(__assign({}, getPropertyMembers(type)), { actions: [], volatile: [], views: [], flowActions: [] });
  var props = Object.getOwnPropertyNames(target);
  props.forEach(function(key) {
    if (key in reflected.properties)
      return;
    var descriptor = Object.getOwnPropertyDescriptor(target, key);
    if (descriptor.get) {
      if (isComputedProp(target, key))
        reflected.views.push(key);
      else
        reflected.volatile.push(key);
      return;
    }
    if (descriptor.value._isFlowAction === true) {
      reflected.flowActions.push(key);
    }
    if (descriptor.value._isMSTAction === true) {
      reflected.actions.push(key);
    } else if (isObservableProp(target, key)) {
      reflected.volatile.push(key);
    } else {
      reflected.views.push(key);
    }
  });
  return reflected;
}
function cast(snapshotOrInstance) {
  return snapshotOrInstance;
}
function castToSnapshot(snapshotOrInstance) {
  return snapshotOrInstance;
}
function castToReferenceSnapshot(instance) {
  return instance;
}
function getNodeId(target) {
  assertIsStateTreeNode(target, 1);
  return getStateTreeNode(target).nodeId;
}
var BaseNode = (
  /** @class */
  (function() {
    function BaseNode2(type, parent, subpath, environment) {
      Object.defineProperty(this, "type", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: type
      });
      Object.defineProperty(this, "environment", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: environment
      });
      Object.defineProperty(this, "_escapedSubpath", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "_subpath", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "_subpathUponDeath", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "_pathUponDeath", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "storedValue", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "aliveAtom", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "_state", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: NodeLifeCycle.INITIALIZING
      });
      Object.defineProperty(this, "_hookSubscribers", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "_parent", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "pathAtom", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      this.environment = environment;
      this.baseSetParent(parent, subpath);
    }
    Object.defineProperty(BaseNode2.prototype, "subpath", {
      get: function() {
        return this._subpath;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BaseNode2.prototype, "subpathUponDeath", {
      get: function() {
        return this._subpathUponDeath;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BaseNode2.prototype, "pathUponDeath", {
      get: function() {
        return this._pathUponDeath;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BaseNode2.prototype, "value", {
      get: function() {
        return this.type.getValue(this);
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BaseNode2.prototype, "state", {
      get: function() {
        return this._state;
      },
      set: function(val) {
        var wasAlive = this.isAlive;
        this._state = val;
        var isAlive2 = this.isAlive;
        if (this.aliveAtom && wasAlive !== isAlive2) {
          this.aliveAtom.reportChanged();
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BaseNode2.prototype, "fireInternalHook", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(name) {
        if (this._hookSubscribers) {
          this._hookSubscribers.emit(name, this, name);
        }
      }
    });
    Object.defineProperty(BaseNode2.prototype, "registerHook", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(hook, hookHandler) {
        if (!this._hookSubscribers) {
          this._hookSubscribers = new EventHandlers();
        }
        return this._hookSubscribers.register(hook, hookHandler);
      }
    });
    Object.defineProperty(BaseNode2.prototype, "parent", {
      get: function() {
        return this._parent;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BaseNode2.prototype, "getReconciliationType", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        return this.type;
      }
    });
    Object.defineProperty(BaseNode2.prototype, "baseSetParent", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(parent, subpath) {
        this._parent = parent;
        this._subpath = subpath;
        this._escapedSubpath = void 0;
        if (this.pathAtom) {
          this.pathAtom.reportChanged();
        }
      }
    });
    Object.defineProperty(BaseNode2.prototype, "path", {
      /*
       * Returns (escaped) path representation as string
       */
      get: function() {
        return this.getEscapedPath(true);
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BaseNode2.prototype, "getEscapedPath", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(reportObserved) {
        if (reportObserved) {
          if (!this.pathAtom) {
            this.pathAtom = createAtom("path");
          }
          this.pathAtom.reportObserved();
        }
        if (!this.parent)
          return "";
        if (this._escapedSubpath === void 0) {
          this._escapedSubpath = !this._subpath ? "" : escapeJsonPath(this._subpath);
        }
        return this.parent.getEscapedPath(reportObserved) + "/" + this._escapedSubpath;
      }
    });
    Object.defineProperty(BaseNode2.prototype, "isRoot", {
      get: function() {
        return this.parent === null;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BaseNode2.prototype, "isAlive", {
      get: function() {
        return this.state !== NodeLifeCycle.DEAD;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BaseNode2.prototype, "isDetaching", {
      get: function() {
        return this.state === NodeLifeCycle.DETACHING;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BaseNode2.prototype, "observableIsAlive", {
      get: function() {
        if (!this.aliveAtom) {
          this.aliveAtom = createAtom("alive");
        }
        this.aliveAtom.reportObserved();
        return this.isAlive;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BaseNode2.prototype, "baseFinalizeCreation", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(whenFinalized) {
        if (devMode()) {
          if (!this.isAlive) {
            throw new MstError("assertion failed: cannot finalize the creation of a node that is already dead");
          }
        }
        if (this.state === NodeLifeCycle.CREATED) {
          if (this.parent) {
            if (this.parent.state !== NodeLifeCycle.FINALIZED) {
              return;
            }
            this.fireHook(Hook.afterAttach);
          }
          this.state = NodeLifeCycle.FINALIZED;
          if (whenFinalized) {
            whenFinalized();
          }
        }
      }
    });
    Object.defineProperty(BaseNode2.prototype, "baseFinalizeDeath", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        if (this._hookSubscribers) {
          this._hookSubscribers.clearAll();
        }
        this._subpathUponDeath = this._subpath;
        this._pathUponDeath = this.getEscapedPath(false);
        this.baseSetParent(null, "");
        this.state = NodeLifeCycle.DEAD;
      }
    });
    Object.defineProperty(BaseNode2.prototype, "baseAboutToDie", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        this.fireHook(Hook.beforeDestroy);
      }
    });
    return BaseNode2;
  })()
);
var ScalarNode = (
  /** @class */
  (function(_super) {
    __extends(ScalarNode2, _super);
    function ScalarNode2(simpleType, parent, subpath, environment, initialSnapshot) {
      var _this = _super.call(this, simpleType, parent, subpath, environment) || this;
      try {
        _this.storedValue = simpleType.createNewInstance(initialSnapshot);
      } catch (e) {
        _this.state = NodeLifeCycle.DEAD;
        throw e;
      }
      _this.state = NodeLifeCycle.CREATED;
      _this.finalizeCreation();
      return _this;
    }
    Object.defineProperty(ScalarNode2.prototype, "root", {
      get: function() {
        if (!this.parent)
          throw new MstError("This scalar node is not part of a tree");
        return this.parent.root;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(ScalarNode2.prototype, "setParent", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(newParent, subpath) {
        var parentChanged = this.parent !== newParent;
        var subpathChanged = this.subpath !== subpath;
        if (!parentChanged && !subpathChanged) {
          return;
        }
        if (devMode()) {
          if (!subpath) {
            throw new MstError("assertion failed: subpath expected");
          }
          if (!newParent) {
            throw new MstError("assertion failed: parent expected");
          }
          if (parentChanged) {
            throw new MstError("assertion failed: scalar nodes cannot change their parent");
          }
        }
        this.environment = void 0;
        this.baseSetParent(this.parent, subpath);
      }
    });
    Object.defineProperty(ScalarNode2.prototype, "snapshot", {
      get: function() {
        return freeze(this.getSnapshot());
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(ScalarNode2.prototype, "getSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        return this.type.getSnapshot(this);
      }
    });
    Object.defineProperty(ScalarNode2.prototype, "toString", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        var path = (this.isAlive ? this.path : this.pathUponDeath) || "<root>";
        return "".concat(this.type.name, "@").concat(path).concat(this.isAlive ? "" : " [dead]");
      }
    });
    Object.defineProperty(ScalarNode2.prototype, "die", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        if (!this.isAlive || this.state === NodeLifeCycle.DETACHING)
          return;
        this.aboutToDie();
        this.finalizeDeath();
      }
    });
    Object.defineProperty(ScalarNode2.prototype, "finalizeCreation", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        this.baseFinalizeCreation();
      }
    });
    Object.defineProperty(ScalarNode2.prototype, "aboutToDie", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        this.baseAboutToDie();
      }
    });
    Object.defineProperty(ScalarNode2.prototype, "finalizeDeath", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        this.baseFinalizeDeath();
      }
    });
    Object.defineProperty(ScalarNode2.prototype, "fireHook", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(name) {
        this.fireInternalHook(name);
      }
    });
    return ScalarNode2;
  })(BaseNode)
);
ScalarNode.prototype.die = action(ScalarNode.prototype.die);
var nextNodeId = 1;
var ObservableInstanceLifecycle;
(function(ObservableInstanceLifecycle2) {
  ObservableInstanceLifecycle2[ObservableInstanceLifecycle2["UNINITIALIZED"] = 0] = "UNINITIALIZED";
  ObservableInstanceLifecycle2[ObservableInstanceLifecycle2["CREATING"] = 1] = "CREATING";
  ObservableInstanceLifecycle2[ObservableInstanceLifecycle2["CREATED"] = 2] = "CREATED";
})(ObservableInstanceLifecycle || (ObservableInstanceLifecycle = {}));
var InternalEvents;
(function(InternalEvents2) {
  InternalEvents2["Dispose"] = "dispose";
  InternalEvents2["Patch"] = "patch";
  InternalEvents2["Snapshot"] = "snapshot";
})(InternalEvents || (InternalEvents = {}));
var snapshotReactionOptions = {
  onError: function(e) {
    throw e;
  }
};
var ObjectNode = (
  /** @class */
  (function(_super) {
    __extends(ObjectNode2, _super);
    function ObjectNode2(complexType, parent, subpath, environment, initialValue) {
      var _this = _super.call(this, complexType, parent, subpath, environment) || this;
      Object.defineProperty(_this, "nodeId", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: ++nextNodeId
      });
      Object.defineProperty(_this, "identifierAttribute", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(_this, "identifier", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(_this, "unnormalizedIdentifier", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(_this, "identifierCache", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(_this, "isProtectionEnabled", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: true
      });
      Object.defineProperty(_this, "middlewares", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(_this, "hasSnapshotPostProcessor", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: false
      });
      Object.defineProperty(_this, "_applyPatches", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(_this, "_applySnapshot", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(_this, "_autoUnbox", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: true
      });
      Object.defineProperty(_this, "_isRunningAction", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: false
      });
      Object.defineProperty(_this, "_hasSnapshotReaction", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: false
      });
      Object.defineProperty(_this, "_endOfActionCallbacks", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(_this, "_observableInstanceState", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: ObservableInstanceLifecycle.UNINITIALIZED
      });
      Object.defineProperty(_this, "_childNodes", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(_this, "_initialSnapshot", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(_this, "_cachedInitialSnapshot", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(_this, "_cachedInitialSnapshotCreated", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: false
      });
      Object.defineProperty(_this, "_snapshotComputed", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(_this, "_snapshotUponDeath", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(_this, "_internalEvents", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      _this._snapshotComputed = computed(function() {
        return freeze(_this.getSnapshot());
      });
      _this.unbox = _this.unbox.bind(_this);
      _this._initialSnapshot = freeze(initialValue);
      _this.identifierAttribute = complexType.identifierAttribute;
      if (!parent) {
        _this.identifierCache = new IdentifierCache();
      }
      _this._childNodes = complexType.initializeChildNodes(_this, _this._initialSnapshot);
      _this.identifier = null;
      _this.unnormalizedIdentifier = null;
      if (_this.identifierAttribute && _this._initialSnapshot) {
        var id = _this._initialSnapshot[_this.identifierAttribute];
        if (id === void 0) {
          var childNode = _this._childNodes[_this.identifierAttribute];
          if (childNode) {
            id = childNode.value;
          }
        }
        if (typeof id !== "string" && typeof id !== "number" && typeof id !== "bigint") {
          throw new MstError("Instance identifier '".concat(_this.identifierAttribute, "' for type '").concat(_this.type.name, "' must be a string, a number or a bigint"));
        }
        _this.identifier = normalizeIdentifier(id);
        _this.unnormalizedIdentifier = id;
      }
      if (!parent) {
        _this.identifierCache.addNodeToCache(_this);
      } else {
        parent.root.identifierCache.addNodeToCache(_this);
      }
      return _this;
    }
    Object.defineProperty(ObjectNode2.prototype, "applyPatches", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(patches) {
        this.createObservableInstanceIfNeeded();
        this._applyPatches(patches);
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "applySnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(snapshot) {
        this.createObservableInstanceIfNeeded();
        this._applySnapshot(snapshot);
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "createObservableInstanceIfNeeded", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(fireHooks) {
        if (fireHooks === void 0) {
          fireHooks = true;
        }
        if (this._observableInstanceState === ObservableInstanceLifecycle.UNINITIALIZED) {
          this.createObservableInstance(fireHooks);
        }
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "createObservableInstance", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(fireHooks) {
        var e_1, _a2, e_2, _b;
        if (fireHooks === void 0) {
          fireHooks = true;
        }
        if (devMode()) {
          if (this.state !== NodeLifeCycle.INITIALIZING) {
            throw new MstError("assertion failed: the creation of the observable instance must be done on the initializing phase");
          }
        }
        this._observableInstanceState = ObservableInstanceLifecycle.CREATING;
        var parentChain = [];
        var parent = this.parent;
        while (parent && parent._observableInstanceState === ObservableInstanceLifecycle.UNINITIALIZED) {
          parentChain.unshift(parent);
          parent = parent.parent;
        }
        try {
          for (var parentChain_1 = __values(parentChain), parentChain_1_1 = parentChain_1.next(); !parentChain_1_1.done; parentChain_1_1 = parentChain_1.next()) {
            var p = parentChain_1_1.value;
            p.createObservableInstanceIfNeeded(false);
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (parentChain_1_1 && !parentChain_1_1.done && (_a2 = parentChain_1.return)) _a2.call(parentChain_1);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
        var type = this.type;
        try {
          this.storedValue = type.createNewInstance(this._childNodes);
          this.preboot();
          this._isRunningAction = true;
          type.finalizeNewInstance(this, this.storedValue);
        } catch (e) {
          this.state = NodeLifeCycle.DEAD;
          throw e;
        } finally {
          this._isRunningAction = false;
        }
        this._observableInstanceState = ObservableInstanceLifecycle.CREATED;
        this._snapshotComputed.trackAndCompute();
        if (this.isRoot)
          this._addSnapshotReaction();
        this._childNodes = EMPTY_OBJECT;
        this.state = NodeLifeCycle.CREATED;
        if (fireHooks) {
          this.fireHook(Hook.afterCreate);
          this.finalizeCreation();
          try {
            for (var _c = __values(parentChain.reverse()), _d = _c.next(); !_d.done; _d = _c.next()) {
              var p = _d.value;
              p.fireHook(Hook.afterCreate);
              p.finalizeCreation();
            }
          } catch (e_2_1) {
            e_2 = { error: e_2_1 };
          } finally {
            try {
              if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
            } finally {
              if (e_2) throw e_2.error;
            }
          }
        }
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "root", {
      get: function() {
        var parent = this.parent;
        return parent ? parent.root : this;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(ObjectNode2.prototype, "enqueueEndOfAction", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(callback) {
        var root = this.root;
        if (!root._endOfActionCallbacks) {
          root._endOfActionCallbacks = [];
        }
        root._endOfActionCallbacks.push(callback);
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "flushEndOfActionCallbacks", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        var root = this.root;
        while (root._endOfActionCallbacks && root._endOfActionCallbacks.length > 0) {
          var callbacks = root._endOfActionCallbacks;
          root._endOfActionCallbacks = void 0;
          callbacks.forEach(function(callback) {
            callback();
          });
        }
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "clearParent", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        if (!this.parent)
          return;
        this.fireHook(Hook.beforeDetach);
        var previousState = this.state;
        this.state = NodeLifeCycle.DETACHING;
        var root = this.root;
        var newEnv = root.environment;
        var newIdCache = root.identifierCache.splitCache(this);
        try {
          this.parent.removeChild(this.subpath);
          this.baseSetParent(null, "");
          this.environment = newEnv;
          this.identifierCache = newIdCache;
        } finally {
          this.state = previousState;
        }
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "setParent", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(newParent, subpath) {
        var parentChanged = newParent !== this.parent;
        var subpathChanged = subpath !== this.subpath;
        if (!parentChanged && !subpathChanged) {
          return;
        }
        if (devMode()) {
          if (!subpath) {
            throw new MstError("assertion failed: subpath expected");
          }
          if (!newParent) {
            throw new MstError("assertion failed: new parent expected");
          }
          if (this.parent && parentChanged) {
            throw new MstError("A node cannot exists twice in the state tree. Failed to add ".concat(this, " to path '").concat(newParent.path, "/").concat(subpath, "'."));
          }
          if (!this.parent && newParent.root === this) {
            throw new MstError("A state tree is not allowed to contain itself. Cannot assign ".concat(this, " to path '").concat(newParent.path, "/").concat(subpath, "'"));
          }
          if (!this.parent && !!this.environment && this.environment !== newParent.root.environment) {
            throw new MstError("A state tree cannot be made part of another state tree as long as their environments are different.");
          }
        }
        if (parentChanged) {
          this.environment = void 0;
          newParent.root.identifierCache.mergeCache(this);
          this.baseSetParent(newParent, subpath);
          this.fireHook(Hook.afterAttach);
        } else if (subpathChanged) {
          this.baseSetParent(this.parent, subpath);
        }
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "fireHook", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(name) {
        var _this = this;
        this.fireInternalHook(name);
        var fn = this.storedValue && typeof this.storedValue === "object" && this.storedValue[name];
        if (typeof fn === "function") {
          if (runInAction) {
            runInAction(function() {
              fn.apply(_this.storedValue);
            });
          } else {
            fn.apply(this.storedValue);
          }
        }
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "snapshot", {
      // advantage of using computed for a snapshot is that nicely respects transactions etc.
      get: function() {
        if (this.hasSnapshotPostProcessor) {
          this.createObservableInstanceIfNeeded();
        }
        return this._snapshotComputed.get();
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(ObjectNode2.prototype, "getSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        if (!this.isAlive)
          return this._snapshotUponDeath;
        return this._observableInstanceState === ObservableInstanceLifecycle.CREATED ? this._getActualSnapshot() : this._getCachedInitialSnapshot();
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "_getActualSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        return this.type.getSnapshot(this);
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "_getCachedInitialSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        if (!this._cachedInitialSnapshotCreated) {
          var type = this.type;
          var childNodes = this._childNodes;
          var snapshot = this._initialSnapshot;
          this._cachedInitialSnapshot = type.processInitialSnapshot(childNodes, snapshot);
          this._cachedInitialSnapshotCreated = true;
        }
        return this._cachedInitialSnapshot;
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "isRunningAction", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        if (this._isRunningAction)
          return true;
        if (this.isRoot)
          return false;
        return this.parent.isRunningAction();
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "assertAlive", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(context) {
        var livelinessChecking2 = getLivelinessChecking();
        if (!this.isAlive && livelinessChecking2 !== "ignore") {
          var error = this._getAssertAliveError(context);
          switch (livelinessChecking2) {
            case "error":
              throw new MstError(error);
            case "warn":
              warnError(error);
          }
        }
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "_getAssertAliveError", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(context) {
        var escapedPath = this.getEscapedPath(false) || this.pathUponDeath || "";
        var subpath = context.subpath && escapeJsonPath(context.subpath) || "";
        var actionContext = context.actionContext || getCurrentActionContext();
        if (actionContext && actionContext.type !== "action" && actionContext.parentActionEvent) {
          actionContext = actionContext.parentActionEvent;
        }
        var actionFullPath = "";
        if (actionContext && actionContext.name != null) {
          var actionPath = actionContext && actionContext.context && getPath(actionContext.context) || escapedPath;
          actionFullPath = "".concat(actionPath, ".").concat(actionContext.name, "()");
        }
        return "You are trying to read or write to an object that is no longer part of a state tree. (Object type: '".concat(this.type.name, "', Path upon death: '").concat(escapedPath, "', Subpath: '").concat(subpath, "', Action: '").concat(actionFullPath, "'). Either detach nodes first, or don't use objects after removing / replacing them in the tree.");
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "getChildNode", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(subpath) {
        this.assertAlive({
          subpath
        });
        this._autoUnbox = false;
        try {
          return this._observableInstanceState === ObservableInstanceLifecycle.CREATED ? this.type.getChildNode(this, subpath) : this._childNodes[subpath];
        } finally {
          this._autoUnbox = true;
        }
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "getChildren", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        this.assertAlive(EMPTY_OBJECT);
        this._autoUnbox = false;
        try {
          return this._observableInstanceState === ObservableInstanceLifecycle.CREATED ? this.type.getChildren(this) : convertChildNodesToArray(this._childNodes);
        } finally {
          this._autoUnbox = true;
        }
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "getChildType", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(propertyName) {
        return this.type.getChildType(propertyName);
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "isProtected", {
      get: function() {
        return this.root.isProtectionEnabled;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(ObjectNode2.prototype, "assertWritable", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(context) {
        this.assertAlive(context);
        if (!this.isRunningAction() && this.isProtected) {
          throw new MstError("Cannot modify '".concat(this, "', the object is protected and can only be modified by using an action."));
        }
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "removeChild", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(subpath) {
        this.type.removeChild(this, subpath);
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "unbox", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(childNode) {
        if (!childNode)
          return childNode;
        this.assertAlive({
          subpath: childNode.subpath || childNode.subpathUponDeath
        });
        return this._autoUnbox ? childNode.value : childNode;
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "toString", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        var path = (this.isAlive ? this.path : this.pathUponDeath) || "<root>";
        var identifier2 = this.identifier ? "(id: ".concat(this.identifier, ")") : "";
        return "".concat(this.type.name, "@").concat(path).concat(identifier2).concat(this.isAlive ? "" : " [dead]");
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "finalizeCreation", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        var _this = this;
        this.baseFinalizeCreation(function() {
          var e_3, _a2;
          try {
            for (var _b = __values(_this.getChildren()), _c = _b.next(); !_c.done; _c = _b.next()) {
              var child = _c.value;
              child.finalizeCreation();
            }
          } catch (e_3_1) {
            e_3 = { error: e_3_1 };
          } finally {
            try {
              if (_c && !_c.done && (_a2 = _b.return)) _a2.call(_b);
            } finally {
              if (e_3) throw e_3.error;
            }
          }
          _this.fireInternalHook(Hook.afterCreationFinalization);
        });
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "detach", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        if (!this.isAlive)
          throw new MstError("Error while detaching, node is not alive.");
        this.clearParent();
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "preboot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        var self = this;
        this._applyPatches = createActionInvoker(this.storedValue, "@APPLY_PATCHES", function(patches) {
          patches.forEach(function(patch) {
            if (!patch.path) {
              self.type.applySnapshot(self, patch.value);
              return;
            }
            var parts = splitJsonPath(patch.path);
            var node = resolveNodeByPathParts(self, parts.slice(0, -1));
            node.applyPatchLocally(parts[parts.length - 1], patch);
          });
        });
        this._applySnapshot = createActionInvoker(this.storedValue, "@APPLY_SNAPSHOT", function(snapshot) {
          if (snapshot === self.snapshot)
            return;
          return self.type.applySnapshot(self, snapshot);
        });
        addHiddenFinalProp(this.storedValue, "$treenode", this);
        addHiddenFinalProp(this.storedValue, "toJSON", toJSON);
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "die", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        if (!this.isAlive || this.state === NodeLifeCycle.DETACHING)
          return;
        this.aboutToDie();
        this.finalizeDeath();
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "aboutToDie", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        if (this._observableInstanceState === ObservableInstanceLifecycle.UNINITIALIZED) {
          return;
        }
        this.getChildren().forEach(function(node) {
          node.aboutToDie();
        });
        this.baseAboutToDie();
        this._internalEventsEmit(InternalEvents.Dispose);
        this._internalEventsClear(InternalEvents.Dispose);
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "finalizeDeath", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        this.getChildren().forEach(function(node) {
          node.finalizeDeath();
        });
        this.root.identifierCache.notifyDied(this);
        var snapshot = this.snapshot;
        this._snapshotUponDeath = snapshot;
        this._internalEventsClearAll();
        this.baseFinalizeDeath();
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "onSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(onChange) {
        this._addSnapshotReaction();
        return this._internalEventsRegister(InternalEvents.Snapshot, onChange);
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "emitSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(snapshot) {
        this._internalEventsEmit(InternalEvents.Snapshot, snapshot);
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "onPatch", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(handler) {
        return this._internalEventsRegister(InternalEvents.Patch, handler);
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "hasPatchSubscribers", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        if (this._internalEventsHasSubscribers(InternalEvents.Patch)) {
          return true;
        }
        return this.parent ? this.parent.hasPatchSubscribers() : false;
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "emitPatch", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(basePatch, source) {
        if (this._internalEventsHasSubscribers(InternalEvents.Patch)) {
          var path = source.path.substr(this.path.length) + (basePatch.path ? "/" + basePatch.path : "");
          var localizedPatch = extend({}, basePatch, { path });
          var _a2 = __read(splitPatch(localizedPatch), 2), patch = _a2[0], reversePatch = _a2[1];
          this._internalEventsEmit(InternalEvents.Patch, patch, reversePatch);
        }
        if (this.parent)
          this.parent.emitPatch(basePatch, source);
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "hasDisposer", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(disposer) {
        return this._internalEventsHas(InternalEvents.Dispose, disposer);
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "addDisposer", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(disposer) {
        if (!this.hasDisposer(disposer)) {
          this._internalEventsRegister(InternalEvents.Dispose, disposer, true);
          return;
        }
        throw new MstError("cannot add a disposer when it is already registered for execution");
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "removeDisposer", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(disposer) {
        if (!this._internalEventsHas(InternalEvents.Dispose, disposer)) {
          throw new MstError("cannot remove a disposer which was never registered for execution");
        }
        this._internalEventsUnregister(InternalEvents.Dispose, disposer);
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "removeMiddleware", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(middleware) {
        if (this.middlewares) {
          var index = this.middlewares.indexOf(middleware);
          if (index >= 0) {
            this.middlewares.splice(index, 1);
          }
        }
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "addMiddleWare", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(handler, includeHooks) {
        var _this = this;
        if (includeHooks === void 0) {
          includeHooks = true;
        }
        var middleware = { handler, includeHooks };
        if (!this.middlewares)
          this.middlewares = [middleware];
        else
          this.middlewares.push(middleware);
        return function() {
          _this.removeMiddleware(middleware);
        };
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "applyPatchLocally", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(subpath, patch) {
        this.assertWritable({
          subpath
        });
        this.createObservableInstanceIfNeeded();
        this.type.applyPatchLocally(this, subpath, patch);
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "_addSnapshotReaction", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        var _this = this;
        if (!this._hasSnapshotReaction) {
          var snapshotDisposer = reaction(function() {
            return _this.snapshot;
          }, function(snapshot) {
            return _this.emitSnapshot(snapshot);
          }, snapshotReactionOptions);
          this.addDisposer(snapshotDisposer);
          this._hasSnapshotReaction = true;
        }
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "_internalEventsHasSubscribers", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(event) {
        return !!this._internalEvents && this._internalEvents.hasSubscribers(event);
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "_internalEventsRegister", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(event, eventHandler, atTheBeginning) {
        if (atTheBeginning === void 0) {
          atTheBeginning = false;
        }
        if (!this._internalEvents) {
          this._internalEvents = new EventHandlers();
        }
        return this._internalEvents.register(event, eventHandler, atTheBeginning);
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "_internalEventsHas", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(event, eventHandler) {
        return !!this._internalEvents && this._internalEvents.has(event, eventHandler);
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "_internalEventsUnregister", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(event, eventHandler) {
        if (this._internalEvents) {
          this._internalEvents.unregister(event, eventHandler);
        }
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "_internalEventsEmit", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(event) {
        var _a2;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
          args[_i - 1] = arguments[_i];
        }
        if (this._internalEvents) {
          (_a2 = this._internalEvents).emit.apply(_a2, __spreadArray([event], __read(args), false));
        }
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "_internalEventsClear", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(event) {
        if (this._internalEvents) {
          this._internalEvents.clear(event);
        }
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "_internalEventsClearAll", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        if (this._internalEvents) {
          this._internalEvents.clearAll();
        }
      }
    });
    return ObjectNode2;
  })(BaseNode)
);
ObjectNode.prototype.createObservableInstance = action(ObjectNode.prototype.createObservableInstance);
ObjectNode.prototype.detach = action(ObjectNode.prototype.detach);
ObjectNode.prototype.die = action(ObjectNode.prototype.die);
var _a;
var TypeFlags;
(function(TypeFlags2) {
  TypeFlags2[TypeFlags2["String"] = 1] = "String";
  TypeFlags2[TypeFlags2["Number"] = 2] = "Number";
  TypeFlags2[TypeFlags2["Boolean"] = 4] = "Boolean";
  TypeFlags2[TypeFlags2["Date"] = 8] = "Date";
  TypeFlags2[TypeFlags2["Literal"] = 16] = "Literal";
  TypeFlags2[TypeFlags2["Array"] = 32] = "Array";
  TypeFlags2[TypeFlags2["Map"] = 64] = "Map";
  TypeFlags2[TypeFlags2["Object"] = 128] = "Object";
  TypeFlags2[TypeFlags2["Frozen"] = 256] = "Frozen";
  TypeFlags2[TypeFlags2["Optional"] = 512] = "Optional";
  TypeFlags2[TypeFlags2["Reference"] = 1024] = "Reference";
  TypeFlags2[TypeFlags2["Identifier"] = 2048] = "Identifier";
  TypeFlags2[TypeFlags2["Late"] = 4096] = "Late";
  TypeFlags2[TypeFlags2["Refinement"] = 8192] = "Refinement";
  TypeFlags2[TypeFlags2["Union"] = 16384] = "Union";
  TypeFlags2[TypeFlags2["Null"] = 32768] = "Null";
  TypeFlags2[TypeFlags2["Undefined"] = 65536] = "Undefined";
  TypeFlags2[TypeFlags2["Integer"] = 131072] = "Integer";
  TypeFlags2[TypeFlags2["Custom"] = 262144] = "Custom";
  TypeFlags2[TypeFlags2["SnapshotProcessor"] = 524288] = "SnapshotProcessor";
  TypeFlags2[TypeFlags2["Lazy"] = 1048576] = "Lazy";
  TypeFlags2[TypeFlags2["Finite"] = 2097152] = "Finite";
  TypeFlags2[TypeFlags2["Float"] = 4194304] = "Float";
  TypeFlags2[TypeFlags2["BigInt"] = 8388608] = "BigInt";
})(TypeFlags || (TypeFlags = {}));
var cannotDetermineSubtype = "cannotDetermine";
var $type = Symbol("$type");
var BaseType = (
  /** @class */
  (function() {
    function BaseType2(name) {
      Object.defineProperty(this, _a, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "C", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "S", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "T", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "N", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "isType", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: true
      });
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      this.name = name;
    }
    Object.defineProperty(BaseType2.prototype, "create", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(snapshot, environment) {
        typecheckInternal(this, snapshot);
        return this.instantiate(null, "", environment, snapshot).value;
      }
    });
    Object.defineProperty(BaseType2.prototype, "getSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(node, applyPostProcess) {
        throw new MstError("unimplemented method");
      }
    });
    Object.defineProperty(BaseType2.prototype, "isAssignableFrom", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(type) {
        return type === this;
      }
    });
    Object.defineProperty(BaseType2.prototype, "validate", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(value, context) {
        var node = getStateTreeNodeSafe(value);
        if (node) {
          var valueType = getType(value);
          return this.isAssignableFrom(valueType) ? typeCheckSuccess() : typeCheckFailure(context, value);
        }
        return this.isValidSnapshot(value, context);
      }
    });
    Object.defineProperty(BaseType2.prototype, "is", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(thing) {
        return this.validate(thing, [{ path: "", type: this }]).length === 0;
      }
    });
    Object.defineProperty(BaseType2.prototype, "Type", {
      get: function() {
        throw new MstError("Factory.Type should not be actually called. It is just a Type signature that can be used at compile time with Typescript, by using `typeof type.Type`");
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BaseType2.prototype, "TypeWithoutSTN", {
      get: function() {
        throw new MstError("Factory.TypeWithoutSTN should not be actually called. It is just a Type signature that can be used at compile time with Typescript, by using `typeof type.TypeWithoutSTN`");
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BaseType2.prototype, "SnapshotType", {
      get: function() {
        throw new MstError("Factory.SnapshotType should not be actually called. It is just a Type signature that can be used at compile time with Typescript, by using `typeof type.SnapshotType`");
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BaseType2.prototype, "CreationType", {
      get: function() {
        throw new MstError("Factory.CreationType should not be actually called. It is just a Type signature that can be used at compile time with Typescript, by using `typeof type.CreationType`");
      },
      enumerable: false,
      configurable: true
    });
    return BaseType2;
  })()
);
_a = $type;
BaseType.prototype.create = action(BaseType.prototype.create);
var ComplexType = (
  /** @class */
  (function(_super) {
    __extends(ComplexType2, _super);
    function ComplexType2(name) {
      var _this = _super.call(this, name) || this;
      Object.defineProperty(_this, "identifierAttribute", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      return _this;
    }
    Object.defineProperty(ComplexType2.prototype, "create", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(snapshot, environment) {
        if (snapshot === void 0) {
          snapshot = this.getDefaultSnapshot();
        }
        return _super.prototype.create.call(this, snapshot, environment);
      }
    });
    Object.defineProperty(ComplexType2.prototype, "getValue", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(node) {
        node.createObservableInstanceIfNeeded();
        return node.storedValue;
      }
    });
    Object.defineProperty(ComplexType2.prototype, "isMatchingSnapshotId", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(current, snapshot) {
        return !current.identifierAttribute || current.identifier === normalizeIdentifier(snapshot[current.identifierAttribute]);
      }
    });
    Object.defineProperty(ComplexType2.prototype, "tryToReconcileNode", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(current, newValue) {
        if (current.isDetaching)
          return false;
        if (current.snapshot === newValue) {
          return true;
        }
        if (isStateTreeNode(newValue) && getStateTreeNode(newValue) === current) {
          return true;
        }
        if (current.type === this && isMutable(newValue) && !isStateTreeNode(newValue) && this.isMatchingSnapshotId(current, newValue)) {
          current.applySnapshot(newValue);
          return true;
        }
        return false;
      }
    });
    Object.defineProperty(ComplexType2.prototype, "reconcile", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(current, newValue, parent, subpath) {
        var nodeReconciled = this.tryToReconcileNode(current, newValue);
        if (nodeReconciled) {
          current.setParent(parent, subpath);
          return current;
        }
        current.die();
        if (isStateTreeNode(newValue) && this.isAssignableFrom(getType(newValue))) {
          var newNode = getStateTreeNode(newValue);
          newNode.setParent(parent, subpath);
          return newNode;
        }
        return this.instantiate(parent, subpath, void 0, newValue);
      }
    });
    Object.defineProperty(ComplexType2.prototype, "getSubTypes", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        return null;
      }
    });
    return ComplexType2;
  })(BaseType)
);
ComplexType.prototype.create = action(ComplexType.prototype.create);
var SimpleType = (
  /** @class */
  (function(_super) {
    __extends(SimpleType2, _super);
    function SimpleType2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(SimpleType2.prototype, "createNewInstance", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(snapshot) {
        return snapshot;
      }
    });
    Object.defineProperty(SimpleType2.prototype, "getValue", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(node) {
        return node.storedValue;
      }
    });
    Object.defineProperty(SimpleType2.prototype, "getSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(node) {
        return node.storedValue;
      }
    });
    Object.defineProperty(SimpleType2.prototype, "reconcile", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(current, newValue, parent, subpath) {
        if (!current.isDetaching && current.type === this && current.storedValue === newValue) {
          return current;
        }
        var res = this.instantiate(parent, subpath, void 0, newValue);
        current.die();
        return res;
      }
    });
    Object.defineProperty(SimpleType2.prototype, "getSubTypes", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        return null;
      }
    });
    return SimpleType2;
  })(BaseType)
);
function canApplyDirectSnapshot(childType, childNode, newValue) {
  var reconciliationType = childNode.getReconciliationType();
  var expectedReconciliationType = resolveDirectApplyType(childType);
  var hasMatchingReconciliationType = reconciliationType === expectedReconciliationType;
  return childNode instanceof ObjectNode && hasMatchingReconciliationType && reconciliationType instanceof ComplexType && isMutable(newValue) && !isStateTreeNode(newValue) && reconciliationType.isMatchingSnapshotId(childNode, newValue);
}
function resolveDirectApplyType(type) {
  var subTypes = type.getSubTypes();
  if (!subTypes || Array.isArray(subTypes) || subTypes === cannotDetermineSubtype || !canUnwrapDirectApplyType(type)) {
    return type;
  }
  return resolveDirectApplyType(subTypes);
}
function canUnwrapDirectApplyType(type) {
  var transparentWrapperFlags = TypeFlags.Optional | TypeFlags.Late;
  var nonTransparentWrapperFlags = TypeFlags.Refinement | TypeFlags.SnapshotProcessor | TypeFlags.Union;
  return (type.flags & transparentWrapperFlags) > 0 && (type.flags & nonTransparentWrapperFlags) === 0;
}
function isType(value) {
  return typeof value === "object" && value && value.isType === true;
}
function assertIsType(type, argNumber) {
  assertArg(type, isType, "mobx-state-tree type", argNumber);
}
var runningActions = /* @__PURE__ */ new Map();
function createActionTrackingMiddleware(hooks) {
  return function actionTrackingMiddleware(call, next, abort) {
    switch (call.type) {
      case "action": {
        if (!hooks.filter || hooks.filter(call) === true) {
          var context = hooks.onStart(call);
          hooks.onResume(call, context);
          runningActions.set(call.id, {
            call,
            context,
            async: false
          });
          try {
            var res = next(call);
            hooks.onSuspend(call, context);
            if (runningActions.get(call.id).async === false) {
              runningActions.delete(call.id);
              hooks.onSuccess(call, context, res);
            }
            return res;
          } catch (e) {
            runningActions.delete(call.id);
            hooks.onFail(call, context, e);
            throw e;
          }
        } else {
          return next(call);
        }
      }
      case "flow_spawn": {
        var root = runningActions.get(call.rootId);
        root.async = true;
        return next(call);
      }
      case "flow_resume":
      case "flow_resume_error": {
        var root = runningActions.get(call.rootId);
        hooks.onResume(call, root.context);
        try {
          return next(call);
        } finally {
          hooks.onSuspend(call, root.context);
        }
      }
      case "flow_throw": {
        var root = runningActions.get(call.rootId);
        runningActions.delete(call.rootId);
        hooks.onFail(call, root.context, call.args[0]);
        return next(call);
      }
      case "flow_return": {
        var root = runningActions.get(call.rootId);
        runningActions.delete(call.rootId);
        hooks.onSuccess(call, root.context, call.args[0]);
        return next(call);
      }
    }
  };
}
var RunningAction = (
  /** @class */
  (function() {
    function RunningAction2(hooks, call) {
      Object.defineProperty(this, "hooks", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: hooks
      });
      Object.defineProperty(this, "call", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: call
      });
      Object.defineProperty(this, "flowsPending", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 0
      });
      Object.defineProperty(this, "running", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: true
      });
      if (hooks) {
        hooks.onStart(call);
      }
    }
    Object.defineProperty(RunningAction2.prototype, "finish", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(error) {
        if (this.running) {
          this.running = false;
          if (this.hooks) {
            this.hooks.onFinish(this.call, error);
          }
        }
      }
    });
    Object.defineProperty(RunningAction2.prototype, "incFlowsPending", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        this.flowsPending++;
      }
    });
    Object.defineProperty(RunningAction2.prototype, "decFlowsPending", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        this.flowsPending--;
      }
    });
    Object.defineProperty(RunningAction2.prototype, "hasFlowsPending", {
      get: function() {
        return this.flowsPending > 0;
      },
      enumerable: false,
      configurable: true
    });
    return RunningAction2;
  })()
);
function createActionTrackingMiddleware2(middlewareHooks) {
  var runningActions2 = /* @__PURE__ */ new Map();
  return function actionTrackingMiddleware(call, next) {
    var parentRunningAction = call.parentActionEvent ? runningActions2.get(call.parentActionEvent.id) : void 0;
    if (call.type === "action") {
      var newCall = __assign(__assign({}, call), {
        // make a shallow copy of the parent action env
        env: parentRunningAction && parentRunningAction.call.env,
        parentCall: parentRunningAction && parentRunningAction.call
      });
      var passesFilter = !middlewareHooks.filter || middlewareHooks.filter(newCall);
      var hooks = passesFilter ? middlewareHooks : void 0;
      var runningAction = new RunningAction(hooks, newCall);
      runningActions2.set(call.id, runningAction);
      var res = void 0;
      try {
        res = next(call);
      } catch (e) {
        runningActions2.delete(call.id);
        runningAction.finish(e);
        throw e;
      }
      if (!runningAction.hasFlowsPending) {
        runningActions2.delete(call.id);
        runningAction.finish();
      }
      return res;
    } else {
      if (!parentRunningAction) {
        return next(call);
      }
      switch (call.type) {
        case "flow_spawn": {
          parentRunningAction.incFlowsPending();
          return next(call);
        }
        case "flow_resume":
        case "flow_resume_error": {
          return next(call);
        }
        case "flow_throw": {
          var error = call.args[0];
          try {
            return next(call);
          } finally {
            parentRunningAction.decFlowsPending();
            if (!parentRunningAction.hasFlowsPending) {
              runningActions2.delete(call.parentActionEvent.id);
              parentRunningAction.finish(error);
            }
          }
        }
        case "flow_return": {
          try {
            return next(call);
          } finally {
            parentRunningAction.decFlowsPending();
            if (!parentRunningAction.hasFlowsPending) {
              runningActions2.delete(call.parentActionEvent.id);
              parentRunningAction.finish();
            }
          }
        }
      }
    }
  };
}
function serializeArgument(node, actionName, index, arg) {
  if (arg instanceof Date)
    return { $MST_DATE: arg.getTime() };
  if (isPrimitive(arg))
    return arg;
  if (isStateTreeNode(arg))
    return serializeTheUnserializable("[MSTNode: ".concat(getType(arg).name, "]"));
  if (typeof arg === "function")
    return serializeTheUnserializable("[function]");
  if (typeof arg === "object" && !isPlainObject(arg) && !isArray(arg))
    return serializeTheUnserializable("[object ".concat(arg && arg.constructor && arg.constructor.name || "Complex Object", "]"));
  try {
    JSON.stringify(arg);
    return arg;
  } catch (e) {
    return serializeTheUnserializable("" + e);
  }
}
function deserializeArgument(adm, value) {
  if (value && typeof value === "object" && "$MST_DATE" in value)
    return new Date(value["$MST_DATE"]);
  return value;
}
function serializeTheUnserializable(baseType) {
  return {
    $MST_UNSERIALIZABLE: true,
    type: baseType
  };
}
function applyAction(target, actions) {
  assertIsStateTreeNode(target, 1);
  assertArg(actions, function(a) {
    return typeof a === "object";
  }, "object or array", 2);
  runInAction(function() {
    asArray(actions).forEach(function(action2) {
      return baseApplyAction(target, action2);
    });
  });
}
function baseApplyAction(target, action2) {
  var resolvedTarget = tryResolve(target, action2.path || "");
  if (!resolvedTarget)
    throw new MstError("Invalid action path: ".concat(action2.path || ""));
  var node = getStateTreeNode(resolvedTarget);
  if (action2.name === "@APPLY_PATCHES") {
    return applyPatch.call(null, resolvedTarget, action2.args[0]);
  }
  if (action2.name === "@APPLY_SNAPSHOT") {
    return applySnapshot.call(null, resolvedTarget, action2.args[0]);
  }
  if (!(typeof resolvedTarget[action2.name] === "function"))
    throw new MstError("Action '".concat(action2.name, "' does not exist in '").concat(node.path, "'"));
  return resolvedTarget[action2.name].apply(resolvedTarget, action2.args ? action2.args.map(function(v) {
    return deserializeArgument(node, v);
  }) : []);
}
function recordActions(subject, filter) {
  assertIsStateTreeNode(subject, 1);
  var actions = [];
  var listener = function(call) {
    var recordThis = filter ? filter(call, getRunningActionContext()) : true;
    if (recordThis) {
      actions.push(call);
    }
  };
  var disposer;
  var recorder = {
    actions,
    get recording() {
      return !!disposer;
    },
    stop: function() {
      if (disposer) {
        disposer();
        disposer = void 0;
      }
    },
    resume: function() {
      if (disposer)
        return;
      disposer = onAction(subject, listener);
    },
    replay: function(target) {
      applyAction(target, actions);
    }
  };
  recorder.resume();
  return recorder;
}
function onAction(target, listener, attachAfter) {
  if (attachAfter === void 0) {
    attachAfter = false;
  }
  assertIsStateTreeNode(target, 1);
  if (devMode()) {
    if (!isRoot(target))
      warnError("Warning: Attaching onAction listeners to non root nodes is dangerous: No events will be emitted for actions initiated higher up in the tree.");
    if (!isProtected(target))
      warnError("Warning: Attaching onAction listeners to non protected nodes is dangerous: No events will be emitted for direct modifications without action.");
  }
  return addMiddleware(target, function handler(rawCall, next) {
    if (rawCall.type === "action" && rawCall.id === rawCall.rootId) {
      var sourceNode_1 = getStateTreeNode(rawCall.context);
      var info = {
        name: rawCall.name,
        path: getRelativePathBetweenNodes(getStateTreeNode(target), sourceNode_1),
        args: rawCall.args.map(function(arg, index) {
          return serializeArgument(sourceNode_1, rawCall.name, index, arg);
        })
      };
      if (attachAfter) {
        var res = next(rawCall);
        listener(info);
        return res;
      } else {
        listener(info);
        return next(rawCall);
      }
    } else {
      return next(rawCall);
    }
  });
}
var nextActionId = 1;
var currentActionContext;
function getCurrentActionContext() {
  return currentActionContext;
}
function getNextActionId() {
  return nextActionId++;
}
function runWithActionContext(context, fn) {
  var node = getStateTreeNode(context.context);
  if (context.type === "action") {
    node.assertAlive({
      actionContext: context
    });
  }
  var baseIsRunningAction = node._isRunningAction;
  node._isRunningAction = true;
  var previousContext = currentActionContext;
  var isRootActionContext = !previousContext;
  currentActionContext = context;
  try {
    return runMiddleWares(node, context, fn, isRootActionContext);
  } finally {
    currentActionContext = previousContext;
    node._isRunningAction = baseIsRunningAction;
  }
}
function getParentActionContext(parentContext) {
  if (!parentContext)
    return void 0;
  if (parentContext.type === "action")
    return parentContext;
  return parentContext.parentActionEvent;
}
function createActionInvoker(target, name, fn) {
  var res = function() {
    var id = getNextActionId();
    var parentContext = currentActionContext;
    var parentActionContext = getParentActionContext(parentContext);
    return runWithActionContext({
      type: "action",
      name,
      id,
      args: argsToArray(arguments),
      context: target,
      tree: getRoot(target),
      rootId: parentContext ? parentContext.rootId : id,
      parentId: parentContext ? parentContext.id : 0,
      allParentIds: parentContext ? __spreadArray(__spreadArray([], __read(parentContext.allParentIds), false), [parentContext.id], false) : [],
      parentEvent: parentContext,
      parentActionEvent: parentActionContext
    }, fn);
  };
  res._isMSTAction = true;
  res._isFlowAction = fn._isFlowAction;
  return res;
}
function addMiddleware(target, handler, includeHooks) {
  if (includeHooks === void 0) {
    includeHooks = true;
  }
  var node = getStateTreeNode(target);
  if (devMode()) {
    if (!node.isProtectionEnabled) {
      warnError("It is recommended to protect the state tree before attaching action middleware, as otherwise it cannot be guaranteed that all changes are passed through middleware. See `protect`");
    }
  }
  return node.addMiddleWare(handler, includeHooks);
}
function decorate(handler, fn, includeHooks) {
  if (includeHooks === void 0) {
    includeHooks = true;
  }
  var middleware = { handler, includeHooks };
  fn.$mst_middleware = fn.$mst_middleware || [];
  fn.$mst_middleware.push(middleware);
  return fn;
}
var CollectedMiddlewares = (
  /** @class */
  (function() {
    function CollectedMiddlewares2(node, fn) {
      Object.defineProperty(this, "arrayIndex", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 0
      });
      Object.defineProperty(this, "inArrayIndex", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 0
      });
      Object.defineProperty(this, "middlewares", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: []
      });
      if (fn.$mst_middleware) {
        this.middlewares.push(fn.$mst_middleware);
      }
      var n = node;
      while (n) {
        if (n.middlewares)
          this.middlewares.push(n.middlewares);
        n = n.parent;
      }
    }
    Object.defineProperty(CollectedMiddlewares2.prototype, "isEmpty", {
      get: function() {
        return this.middlewares.length <= 0;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(CollectedMiddlewares2.prototype, "getNextMiddleware", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        var array2 = this.middlewares[this.arrayIndex];
        if (!array2)
          return void 0;
        var item = array2[this.inArrayIndex++];
        if (!item) {
          this.arrayIndex++;
          this.inArrayIndex = 0;
          return this.getNextMiddleware();
        }
        return item;
      }
    });
    return CollectedMiddlewares2;
  })()
);
function runMiddleWares(node, baseCall, originalFn, isRootActionContext) {
  function runInActionScope(call, fn) {
    var execute = function() {
      var result2;
      var error;
      try {
        result2 = fn.apply(null, call.args);
      } catch (e) {
        error = e;
      }
      if (isRootActionContext || !call.parentActionEvent) {
        try {
          node.root.flushEndOfActionCallbacks();
        } catch (flushError) {
          if (!error) {
            error = flushError;
          }
        }
      }
      if (error) {
        throw error;
      }
      return result2;
    };
    return call.name ? action(call.name, execute)() : action(execute)();
  }
  var middlewares = new CollectedMiddlewares(node, originalFn);
  if (middlewares.isEmpty)
    return runInActionScope(baseCall, originalFn);
  var result = null;
  function runNextMiddleware(call) {
    var middleware = middlewares.getNextMiddleware();
    var handler = middleware && middleware.handler;
    if (!handler) {
      return runInActionScope(call, originalFn);
    }
    if (!middleware.includeHooks && Hook[call.name]) {
      return runNextMiddleware(call);
    }
    var nextInvoked = false;
    function next(call2, callback) {
      nextInvoked = true;
      result = runNextMiddleware(call2);
      if (callback) {
        result = callback(result);
      }
    }
    var abortInvoked = false;
    function abort(value) {
      abortInvoked = true;
      result = value;
    }
    handler(call, next, abort);
    if (devMode()) {
      if (!nextInvoked && !abortInvoked) {
        var node2 = getStateTreeNode(call.tree);
        throw new MstError("Neither the next() nor the abort() callback within the middleware ".concat(handler.name, ' for the action: "').concat(call.name, '" on the node: ').concat(node2.type.name, " was invoked."));
      } else if (nextInvoked && abortInvoked) {
        var node2 = getStateTreeNode(call.tree);
        throw new MstError("The next() and abort() callback within the middleware ".concat(handler.name, ' for the action: "').concat(call.name, '" on the node: ').concat(node2.type.name, " were invoked."));
      }
    }
    if (abortInvoked && (isRootActionContext || !call.parentActionEvent)) {
      return runInActionScope(call, function() {
        return result;
      });
    }
    return result;
  }
  return runNextMiddleware(baseCall);
}
function getRunningActionContext() {
  var current = getCurrentActionContext();
  while (current && current.type !== "action") {
    current = current.parentActionEvent;
  }
  return current;
}
function _isActionContextThisOrChildOf(actionContext, sameOrParent, includeSame) {
  var parentId = typeof sameOrParent === "number" ? sameOrParent : sameOrParent.id;
  var current = includeSame ? actionContext : actionContext.parentActionEvent;
  while (current) {
    if (current.id === parentId) {
      return true;
    }
    current = current.parentActionEvent;
  }
  return false;
}
function isActionContextChildOf(actionContext, parent) {
  return _isActionContextThisOrChildOf(actionContext, parent, false);
}
function isActionContextThisOrChildOf(actionContext, parentOrThis) {
  return _isActionContextThisOrChildOf(actionContext, parentOrThis, true);
}
function safeStringify(value) {
  try {
    return JSON.stringify(value);
  } catch (e) {
    return "<Unserializable: ".concat(e, ">");
  }
}
function prettyPrintValue(value) {
  return typeof value === "function" ? "<function".concat(value.name ? " " + value.name : "", ">") : isStateTreeNode(value) ? "<".concat(value, ">") : "`".concat(safeStringify(value), "`");
}
function shortenPrintValue(valueInString) {
  return valueInString.length < 280 ? valueInString : "".concat(valueInString.substring(0, 272), "......").concat(valueInString.substring(valueInString.length - 8));
}
function toErrorString(error) {
  var value = error.value;
  var type = error.context[error.context.length - 1].type;
  var fullPath = error.context.map(function(_a2) {
    var path = _a2.path;
    return path;
  }).filter(function(path) {
    return path.length > 0;
  }).join("/");
  var pathPrefix = fullPath.length > 0 ? 'at path "/'.concat(fullPath, '" ') : "";
  var currentTypename = isStateTreeNode(value) ? "value of type ".concat(getStateTreeNode(value).type.name, ":") : isPrimitive(value) ? "value" : "snapshot";
  var isSnapshotCompatible = type && isStateTreeNode(value) && type.is(getStateTreeNode(value).snapshot);
  return "".concat(pathPrefix).concat(currentTypename, " ").concat(prettyPrintValue(value), " is not assignable ").concat(type ? "to type: `".concat(type.name, "`") : "") + (error.message ? " (".concat(error.message, ")") : "") + (type ? isPrimitiveType(type) || isPrimitive(value) ? "." : ", expected an instance of `".concat(type.name, "` or a snapshot like `").concat(type.describe(), "` instead.") + (isSnapshotCompatible ? " (Note that a snapshot of the provided value is compatible with the targeted type)" : "") : ".");
}
function getContextForPath(context, path, type) {
  return context.concat([{ path, type }]);
}
function typeCheckSuccess() {
  return EMPTY_ARRAY;
}
function typeCheckFailure(context, value, message) {
  return [{ context, value, message }];
}
function flattenTypeErrors(errors) {
  return errors.reduce(function(a, i) {
    return a.concat(i);
  }, []);
}
function typecheckInternal(type, value) {
  if (isTypeCheckingEnabled()) {
    typecheck(type, value);
  }
}
function typecheck(type, value) {
  var errors = type.validate(value, [{ path: "", type }]);
  if (errors.length > 0) {
    throw new MstError(validationErrorsToString(type, value, errors));
  }
}
function validationErrorsToString(type, value, errors) {
  if (errors.length === 0) {
    return void 0;
  }
  return "Error while converting ".concat(shortenPrintValue(prettyPrintValue(value)), " to `").concat(type.name, "`:\n\n    ") + errors.map(toErrorString).join("\n    ");
}
var identifierCacheId = 0;
var IdentifierCache = (
  /** @class */
  (function() {
    function IdentifierCache2() {
      Object.defineProperty(this, "cacheId", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: identifierCacheId++
      });
      Object.defineProperty(this, "cache", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: observable.map()
      });
      Object.defineProperty(this, "lastCacheModificationPerId", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: observable.map()
      });
    }
    Object.defineProperty(IdentifierCache2.prototype, "updateLastCacheModificationPerId", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(identifier2) {
        var lcm = this.lastCacheModificationPerId.get(identifier2);
        this.lastCacheModificationPerId.set(identifier2, lcm === void 0 ? 1 : lcm + 1);
      }
    });
    Object.defineProperty(IdentifierCache2.prototype, "getLastCacheModificationPerId", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(identifier2) {
        var modificationId = this.lastCacheModificationPerId.get(identifier2) || 0;
        return "".concat(this.cacheId, "-").concat(modificationId);
      }
    });
    Object.defineProperty(IdentifierCache2.prototype, "addNodeToCache", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(node, lastCacheUpdate) {
        if (lastCacheUpdate === void 0) {
          lastCacheUpdate = true;
        }
        if (node.identifierAttribute) {
          var identifier2 = node.identifier;
          if (!this.cache.has(identifier2)) {
            this.cache.set(identifier2, observable.array([], mobxShallow));
          }
          var set2 = this.cache.get(identifier2);
          if (set2.indexOf(node) !== -1)
            throw new MstError("Already registered");
          set2.push(node);
          if (lastCacheUpdate) {
            this.updateLastCacheModificationPerId(identifier2);
          }
        }
      }
    });
    Object.defineProperty(IdentifierCache2.prototype, "mergeCache", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(node) {
        var _this = this;
        values(node.identifierCache.cache).forEach(function(nodes) {
          return nodes.forEach(function(child) {
            _this.addNodeToCache(child);
          });
        });
      }
    });
    Object.defineProperty(IdentifierCache2.prototype, "notifyDied", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(node) {
        if (node.identifierAttribute) {
          var id = node.identifier;
          var set2 = this.cache.get(id);
          if (set2) {
            set2.remove(node);
            if (!set2.length) {
              this.cache.delete(id);
            }
            this.updateLastCacheModificationPerId(node.identifier);
          }
        }
      }
    });
    Object.defineProperty(IdentifierCache2.prototype, "splitCache", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(splitNode) {
        var _this = this;
        var newCache = new IdentifierCache2();
        var basePath = splitNode.path + "/";
        entries(this.cache).forEach(function(_a2) {
          var _b = __read(_a2, 2), id = _b[0], nodes = _b[1];
          var modified = false;
          for (var i = nodes.length - 1; i >= 0; i--) {
            var node = nodes[i];
            if (node === splitNode || node.path.indexOf(basePath) === 0) {
              newCache.addNodeToCache(node, false);
              nodes.splice(i, 1);
              if (!nodes.length) {
                _this.cache.delete(id);
              }
              modified = true;
            }
          }
          if (modified) {
            _this.updateLastCacheModificationPerId(id);
          }
        });
        return newCache;
      }
    });
    Object.defineProperty(IdentifierCache2.prototype, "has", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(type, identifier2) {
        var set2 = this.cache.get(identifier2);
        if (!set2)
          return false;
        return set2.some(function(candidate) {
          return type.isAssignableFrom(candidate.type);
        });
      }
    });
    Object.defineProperty(IdentifierCache2.prototype, "resolve", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(type, identifier2) {
        var set2 = this.cache.get(identifier2);
        if (!set2)
          return null;
        var matches = set2.filter(function(candidate) {
          return type.isAssignableFrom(candidate.type);
        });
        switch (matches.length) {
          case 0:
            return null;
          case 1:
            return matches[0];
          default:
            throw new MstError("Cannot resolve a reference to type '".concat(type.name, "' with id: '").concat(identifier2, "' unambigously, there are multiple candidates: ").concat(matches.map(function(n) {
              return n.path;
            }).join(", ")));
        }
      }
    });
    return IdentifierCache2;
  })()
);
function createObjectNode(type, parent, subpath, environment, initialValue) {
  var existingNode = getStateTreeNodeSafe(initialValue);
  if (existingNode) {
    if (existingNode.parent) {
      throw new MstError("Cannot add an object to a state tree if it is already part of the same or another state tree. Tried to assign an object to '".concat(parent ? parent.path : "", "/").concat(subpath, "', but it lives already at '").concat(existingNode.path, "'"));
    }
    if (parent) {
      existingNode.setParent(parent, subpath);
    }
    return existingNode;
  }
  return new ObjectNode(type, parent, subpath, environment, initialValue);
}
function createScalarNode(type, parent, subpath, environment, initialValue) {
  return new ScalarNode(type, parent, subpath, environment, initialValue);
}
function isNode(value) {
  return value instanceof ScalarNode || value instanceof ObjectNode;
}
var NodeLifeCycle;
(function(NodeLifeCycle2) {
  NodeLifeCycle2[NodeLifeCycle2["INITIALIZING"] = 0] = "INITIALIZING";
  NodeLifeCycle2[NodeLifeCycle2["CREATED"] = 1] = "CREATED";
  NodeLifeCycle2[NodeLifeCycle2["FINALIZED"] = 2] = "FINALIZED";
  NodeLifeCycle2[NodeLifeCycle2["DETACHING"] = 3] = "DETACHING";
  NodeLifeCycle2[NodeLifeCycle2["DEAD"] = 4] = "DEAD";
})(NodeLifeCycle || (NodeLifeCycle = {}));
function isStateTreeNode(value) {
  return !!(value && value.$treenode);
}
function assertIsStateTreeNode(value, argNumber) {
  assertArg(value, isStateTreeNode, "mobx-state-tree node", argNumber);
}
function getStateTreeNode(value) {
  if (!isStateTreeNode(value)) {
    throw new MstError("Value ".concat(value, " is no MST Node"));
  }
  return value.$treenode;
}
function getStateTreeNodeSafe(value) {
  return value && value.$treenode || null;
}
function toJSON() {
  return getStateTreeNode(this).snapshot;
}
var doubleDot = function(_) {
  return "..";
};
function getRelativePathBetweenNodes(base, target) {
  if (base.root !== target.root) {
    throw new MstError("Cannot calculate relative path: objects '".concat(base, "' and '").concat(target, "' are not part of the same object tree"));
  }
  var baseParts = splitJsonPath(base.path);
  var targetParts = splitJsonPath(target.path);
  var common = 0;
  for (; common < baseParts.length; common++) {
    if (baseParts[common] !== targetParts[common])
      break;
  }
  return baseParts.slice(common).map(doubleDot).join("/") + joinJsonPath(targetParts.slice(common));
}
function resolveNodeByPath(base, path, failIfResolveFails) {
  if (failIfResolveFails === void 0) {
    failIfResolveFails = true;
  }
  return resolveNodeByPathParts(base, splitJsonPath(path), failIfResolveFails);
}
function resolveNodeByPathParts(base, pathParts, failIfResolveFails) {
  if (failIfResolveFails === void 0) {
    failIfResolveFails = true;
  }
  var current = base;
  try {
    for (var i = 0; i < pathParts.length; i++) {
      var part = pathParts[i];
      if (part === "..") {
        current = current.parent;
        if (current)
          continue;
      } else if (part === ".") {
        continue;
      } else if (current) {
        if (current instanceof ScalarNode) {
          var value = current.value;
          if (isStateTreeNode(value)) {
            current = getStateTreeNode(value);
          }
        }
        if (current instanceof ObjectNode) {
          var subType = current.getChildType(part);
          if (subType) {
            current = current.getChildNode(part);
            if (current)
              continue;
          }
        }
      }
      throw new MstError("Could not resolve '".concat(part, "' in path '").concat(joinJsonPath(pathParts.slice(0, i)) || "/", "' while resolving '").concat(joinJsonPath(pathParts), "'"));
    }
  } catch (e) {
    if (!failIfResolveFails) {
      return void 0;
    }
    throw e;
  }
  return current;
}
function convertChildNodesToArray(childNodes) {
  if (!childNodes)
    return EMPTY_ARRAY;
  var keys = Object.keys(childNodes);
  if (!keys.length)
    return EMPTY_ARRAY;
  var result = new Array(keys.length);
  keys.forEach(function(key, index) {
    result[index] = childNodes[key];
  });
  return result;
}
var DEPRECATION_MESSAGE = "See https://github.com/mobxjs/mobx-state-tree/issues/399 for more information. Note that the middleware event types starting with `process` now start with `flow`.";
function process$1(asyncAction) {
  deprecated("process", "`process()` has been renamed to `flow()`. " + DEPRECATION_MESSAGE);
  return flow(asyncAction);
}
var plainObjectString = Object.toString();
var EMPTY_ARRAY = Object.freeze([]);
var EMPTY_OBJECT = Object.freeze({});
var mobxShallow = getGlobalState().useProxies ? { deep: false } : { deep: false, proxy: false };
Object.freeze(mobxShallow);
var MstError = (
  /** @class */
  (function(_super) {
    __extends(MstError2, _super);
    function MstError2(message) {
      if (message === void 0) {
        message = "Illegal state";
      }
      return _super.call(this, "[mobx-state-tree] ".concat(message)) || this;
    }
    return MstError2;
  })(Error)
);
function identity(_) {
  return _;
}
var isInteger = Number.isInteger;
function isFloat(val) {
  return Number(val) === val && val % 1 !== 0;
}
function isFinite(val) {
  return Number.isFinite(val);
}
function isArray(val) {
  return Array.isArray(val) || isObservableArray(val);
}
function asArray(val) {
  if (!val)
    return EMPTY_ARRAY;
  if (isArray(val))
    return val;
  return [val];
}
function extend(a) {
  var b = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    b[_i - 1] = arguments[_i];
  }
  for (var i = 0; i < b.length; i++) {
    var current = b[i];
    for (var key in current)
      a[key] = current[key];
  }
  return a;
}
function isPlainObject(value) {
  var _a2;
  if (value === null || typeof value !== "object")
    return false;
  var proto = Object.getPrototypeOf(value);
  if (proto == null)
    return true;
  return ((_a2 = proto.constructor) === null || _a2 === void 0 ? void 0 : _a2.toString()) === plainObjectString;
}
function isMutable(value) {
  return value !== null && typeof value === "object" && !(value instanceof Date) && !(value instanceof RegExp);
}
function isPrimitive(value, includeDate) {
  if (includeDate === void 0) {
    includeDate = true;
  }
  return value === null || value === void 0 || typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "bigint" || includeDate && value instanceof Date;
}
function freeze(value) {
  if (!devMode())
    return value;
  return isPrimitive(value) || isObservableArray(value) ? value : Object.freeze(value);
}
function deepFreeze(value) {
  if (!devMode())
    return value;
  freeze(value);
  if (isPlainObject(value)) {
    Object.keys(value).forEach(function(propKey) {
      if (!isPrimitive(value[propKey]) && !Object.isFrozen(value[propKey])) {
        deepFreeze(value[propKey]);
      }
    });
  }
  return value;
}
function isSerializable(value) {
  return typeof value !== "function";
}
function defineProperty(object, key, descriptor) {
  isObservableObject(object) ? apiDefineProperty(object, key, descriptor) : Object.defineProperty(object, key, descriptor);
}
function addHiddenFinalProp(object, propName, value) {
  defineProperty(object, propName, {
    enumerable: false,
    writable: false,
    configurable: true,
    value
  });
}
function addHiddenWritableProp(object, propName, value) {
  defineProperty(object, propName, {
    enumerable: false,
    writable: true,
    configurable: true,
    value
  });
}
var EventHandler = (
  /** @class */
  (function() {
    function EventHandler2() {
      Object.defineProperty(this, "handlers", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: []
      });
    }
    Object.defineProperty(EventHandler2.prototype, "hasSubscribers", {
      get: function() {
        return this.handlers.length > 0;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(EventHandler2.prototype, "register", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(fn, atTheBeginning) {
        var _this = this;
        if (atTheBeginning === void 0) {
          atTheBeginning = false;
        }
        if (atTheBeginning) {
          this.handlers.unshift(fn);
        } else {
          this.handlers.push(fn);
        }
        return function() {
          _this.unregister(fn);
        };
      }
    });
    Object.defineProperty(EventHandler2.prototype, "has", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(fn) {
        return this.handlers.indexOf(fn) >= 0;
      }
    });
    Object.defineProperty(EventHandler2.prototype, "unregister", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(fn) {
        var index = this.handlers.indexOf(fn);
        if (index >= 0) {
          this.handlers.splice(index, 1);
        }
      }
    });
    Object.defineProperty(EventHandler2.prototype, "clear", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        this.handlers.length = 0;
      }
    });
    Object.defineProperty(EventHandler2.prototype, "emit", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        var handlers = this.handlers.slice();
        handlers.forEach(function(f) {
          return f.apply(void 0, __spreadArray([], __read(args), false));
        });
      }
    });
    return EventHandler2;
  })()
);
var EventHandlers = (
  /** @class */
  (function() {
    function EventHandlers2() {
      Object.defineProperty(this, "eventHandlers", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
    }
    Object.defineProperty(EventHandlers2.prototype, "hasSubscribers", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(event) {
        var handler = this.eventHandlers && this.eventHandlers[event];
        return !!handler && handler.hasSubscribers;
      }
    });
    Object.defineProperty(EventHandlers2.prototype, "register", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(event, fn, atTheBeginning) {
        if (atTheBeginning === void 0) {
          atTheBeginning = false;
        }
        if (!this.eventHandlers) {
          this.eventHandlers = {};
        }
        var handler = this.eventHandlers[event];
        if (!handler) {
          handler = this.eventHandlers[event] = new EventHandler();
        }
        return handler.register(fn, atTheBeginning);
      }
    });
    Object.defineProperty(EventHandlers2.prototype, "has", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(event, fn) {
        var handler = this.eventHandlers && this.eventHandlers[event];
        return !!handler && handler.has(fn);
      }
    });
    Object.defineProperty(EventHandlers2.prototype, "unregister", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(event, fn) {
        var handler = this.eventHandlers && this.eventHandlers[event];
        if (handler) {
          handler.unregister(fn);
        }
      }
    });
    Object.defineProperty(EventHandlers2.prototype, "clear", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(event) {
        if (this.eventHandlers) {
          delete this.eventHandlers[event];
        }
      }
    });
    Object.defineProperty(EventHandlers2.prototype, "clearAll", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        this.eventHandlers = void 0;
      }
    });
    Object.defineProperty(EventHandlers2.prototype, "emit", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(event) {
        var _a2;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
          args[_i - 1] = arguments[_i];
        }
        var handler = this.eventHandlers && this.eventHandlers[event];
        if (handler) {
          (_a2 = handler).emit.apply(_a2, __spreadArray([], __read(args), false));
        }
      }
    });
    return EventHandlers2;
  })()
);
function argsToArray(args) {
  var res = new Array(args.length);
  for (var i = 0; i < args.length; i++)
    res[i] = args[i];
  return res;
}
function stringStartsWith(str, beginning) {
  return str.indexOf(beginning) === 0;
}
var deprecated = function(id, message) {
  if (!devMode())
    return;
  if (deprecated.ids && !deprecated.ids.hasOwnProperty(id)) {
    warnError("Deprecation warning: " + message);
  }
  if (deprecated.ids)
    deprecated.ids[id] = true;
};
deprecated.ids = {};
function warnError(msg) {
  console.warn(new Error("[mobx-state-tree] ".concat(msg)));
}
function isTypeCheckingEnabled() {
  return devMode() || typeof process !== "undefined" && process.env && process.env.ENABLE_TYPE_CHECK === "true";
}
function devMode() {
  return true;
}
function assertArg(value, fn, typeName, argNumber) {
  if (devMode()) {
    if (!fn(value)) {
      throw new MstError("expected ".concat(typeName, " as argument ").concat(asArray(argNumber).join(" or "), ", got ").concat(value, " instead"));
    }
  }
}
function assertIsFunction(value, argNumber) {
  assertArg(value, function(fn) {
    return typeof fn === "function";
  }, "function", argNumber);
}
function assertIsNumber(value, argNumber, min, max) {
  assertArg(value, function(n) {
    return typeof n === "number";
  }, "number", argNumber);
  if (min !== void 0) {
    assertArg(value, function(n) {
      return n >= min;
    }, "number greater than ".concat(min), argNumber);
  }
  if (max !== void 0) {
    assertArg(value, function(n) {
      return n <= max;
    }, "number lesser than ".concat(max), argNumber);
  }
}
function assertIsString(value, argNumber, canBeEmpty) {
  if (canBeEmpty === void 0) {
    canBeEmpty = true;
  }
  assertArg(value, function(s) {
    return typeof s === "string";
  }, "string", argNumber);
  if (!canBeEmpty) {
    assertArg(value, function(s) {
      return s !== "";
    }, "not empty string", argNumber);
  }
}
function setImmediateWithFallback(fn) {
  if (typeof queueMicrotask === "function") {
    queueMicrotask(fn);
  } else if (typeof setImmediate === "function") {
    setImmediate(fn);
  } else {
    setTimeout(fn, 1);
  }
}
function flow(generator) {
  return createFlowSpawner(generator.name, generator);
}
function castFlowReturn(val) {
  return val;
}
function toGeneratorFunction(p) {
  return function() {
    var _i;
    var args = [];
    for (_i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    return __generator(this, function(_a2) {
      switch (_a2.label) {
        case 0:
          return [4, p.apply(void 0, __spreadArray([], __read(args), false))];
        case 1:
          return [2, _a2.sent()];
      }
    });
  };
}
function toGenerator(p) {
  return __generator(this, function(_a2) {
    switch (_a2.label) {
      case 0:
        return [4, p];
      case 1:
        return [2, _a2.sent()];
    }
  });
}
function createFlowSpawner(name, generator) {
  var spawner = function flowSpawner() {
    var runId = getNextActionId();
    var parentContext = getCurrentActionContext();
    if (!parentContext) {
      throw new MstError("a mst flow must always have a parent context");
    }
    var parentActionContext = getParentActionContext(parentContext);
    if (!parentActionContext) {
      throw new MstError("a mst flow must always have a parent action context");
    }
    var contextBase = {
      name,
      id: runId,
      tree: parentContext.tree,
      context: parentContext.context,
      parentId: parentContext.id,
      allParentIds: __spreadArray(__spreadArray([], __read(parentContext.allParentIds), false), [parentContext.id], false),
      rootId: parentContext.rootId,
      parentEvent: parentContext,
      parentActionEvent: parentActionContext
    };
    var args = arguments;
    function wrap(fn, type, arg) {
      fn.$mst_middleware = spawner.$mst_middleware;
      return runWithActionContext(__assign(__assign({}, contextBase), { type, args: [arg] }), fn);
    }
    return new Promise(function(resolve, reject) {
      var gen;
      var init = function asyncActionInit() {
        gen = generator.apply(null, arguments);
        onFulfilled(void 0);
      };
      init.$mst_middleware = spawner.$mst_middleware;
      runWithActionContext(__assign(__assign({}, contextBase), { type: "flow_spawn", args: argsToArray(args) }), init);
      function onFulfilled(res) {
        var ret;
        try {
          var cancelError = wrap(function(r) {
            ret = gen.next(r);
          }, "flow_resume", res);
          if (cancelError instanceof Error) {
            ret = gen.throw(cancelError);
          }
        } catch (e) {
          setImmediateWithFallback(function() {
            wrap(function(r) {
              reject(e);
            }, "flow_throw", e);
          });
          return;
        }
        next(ret);
        return;
      }
      function onRejected(err) {
        var ret;
        try {
          wrap(function(r) {
            ret = gen.throw(r);
          }, "flow_resume_error", err);
        } catch (e) {
          setImmediateWithFallback(function() {
            wrap(function(r) {
              reject(e);
            }, "flow_throw", e);
          });
          return;
        }
        next(ret);
      }
      function next(ret) {
        if (ret.done) {
          setImmediateWithFallback(function() {
            wrap(function(r) {
              resolve(r);
            }, "flow_return", ret.value);
          });
          return;
        }
        if (!ret.value || typeof ret.value.then !== "function") {
          throw new MstError("Only promises can be yielded to `async`, got: " + ret);
        }
        return ret.value.then(onFulfilled, onRejected);
      }
    });
  };
  spawner._isFlowAction = true;
  return spawner;
}
function splitPatch(patch) {
  if (!("oldValue" in patch))
    throw new MstError("Patches without `oldValue` field cannot be inversed");
  return [stripPatch(patch), invertPatch(patch)];
}
function stripPatch(patch) {
  switch (patch.op) {
    case "add":
      return { op: "add", path: patch.path, value: patch.value };
    case "remove":
      return { op: "remove", path: patch.path };
    case "replace":
      return { op: "replace", path: patch.path, value: patch.value };
  }
}
function invertPatch(patch) {
  switch (patch.op) {
    case "add":
      return {
        op: "remove",
        path: patch.path
      };
    case "remove":
      return {
        op: "add",
        path: patch.path,
        value: patch.oldValue
      };
    case "replace":
      return {
        op: "replace",
        path: patch.path,
        value: patch.oldValue
      };
  }
}
function isNumber(x) {
  return typeof x === "number";
}
function escapeJsonPath(path) {
  if (isNumber(path) === true) {
    return "" + path;
  }
  if (path.indexOf("/") === -1 && path.indexOf("~") === -1)
    return path;
  return path.replace(/~/g, "~0").replace(/\//g, "~1");
}
function unescapeJsonPath(path) {
  return path.replace(/~1/g, "/").replace(/~0/g, "~");
}
function joinJsonPath(path) {
  if (path.length === 0)
    return "";
  var getPathStr = function(p) {
    return p.map(escapeJsonPath).join("/");
  };
  if (path[0] === "." || path[0] === "..") {
    return getPathStr(path);
  } else {
    return "/" + getPathStr(path);
  }
}
function splitJsonPath(path) {
  var parts = path.split("/").map(unescapeJsonPath);
  var valid = path === "" || path === "." || path === ".." || stringStartsWith(path, "/") || stringStartsWith(path, "./") || stringStartsWith(path, "../");
  if (!valid) {
    throw new MstError("a json path must be either rooted, empty or relative, but got '".concat(path, "'"));
  }
  if (parts[0] === "") {
    parts.shift();
  }
  return parts;
}
var $preProcessorFailed = Symbol("$preProcessorFailed");
var SnapshotProcessor = (
  /** @class */
  (function(_super) {
    __extends(SnapshotProcessor2, _super);
    function SnapshotProcessor2(_subtype, _processors, name) {
      var _this = _super.call(this, name || _subtype.name) || this;
      Object.defineProperty(_this, "_subtype", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: _subtype
      });
      Object.defineProperty(_this, "_processors", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: _processors
      });
      return _this;
    }
    Object.defineProperty(SnapshotProcessor2.prototype, "flags", {
      get: function() {
        return this._subtype.flags | TypeFlags.SnapshotProcessor;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(SnapshotProcessor2.prototype, "describe", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        return "snapshotProcessor(".concat(this._subtype.describe(), ")");
      }
    });
    Object.defineProperty(SnapshotProcessor2.prototype, "preProcessSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(sn) {
        if (this._processors.preProcessor) {
          return this._processors.preProcessor.call(null, sn);
        }
        return sn;
      }
    });
    Object.defineProperty(SnapshotProcessor2.prototype, "preProcessSnapshotSafe", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(sn) {
        try {
          return this.preProcessSnapshot(sn);
        } catch (e) {
          return $preProcessorFailed;
        }
      }
    });
    Object.defineProperty(SnapshotProcessor2.prototype, "postProcessSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(sn, node) {
        if (this._processors.postProcessor) {
          return this._processors.postProcessor.call(null, sn, node.storedValue);
        }
        return sn;
      }
    });
    Object.defineProperty(SnapshotProcessor2.prototype, "_fixNode", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(node) {
        var _this = this;
        proxyNodeTypeMethods(node.type, this, "create");
        if (node instanceof ObjectNode) {
          node.hasSnapshotPostProcessor = !!this._processors.postProcessor;
        }
        var oldGetSnapshot = node.getSnapshot;
        node.getSnapshot = function() {
          return _this.postProcessSnapshot(oldGetSnapshot.call(node), node);
        };
        if (!isUnionType(this._subtype)) {
          node.getReconciliationType = function() {
            return _this;
          };
        }
      }
    });
    Object.defineProperty(SnapshotProcessor2.prototype, "instantiate", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(parent, subpath, environment, initialValue) {
        var processedInitialValue = isStateTreeNode(initialValue) ? initialValue : this.preProcessSnapshot(initialValue);
        var node = this._subtype.instantiate(parent, subpath, environment, processedInitialValue);
        this._fixNode(node);
        return node;
      }
    });
    Object.defineProperty(SnapshotProcessor2.prototype, "reconcile", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(current, newValue, parent, subpath) {
        var node = this._subtype.reconcile(current, isStateTreeNode(newValue) ? newValue : this.preProcessSnapshot(newValue), parent, subpath);
        if (node !== current) {
          this._fixNode(node);
        }
        return node;
      }
    });
    Object.defineProperty(SnapshotProcessor2.prototype, "getSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(node, applyPostProcess) {
        if (applyPostProcess === void 0) {
          applyPostProcess = true;
        }
        var sn = this._subtype.getSnapshot(node);
        return applyPostProcess ? this.postProcessSnapshot(sn, node) : sn;
      }
    });
    Object.defineProperty(SnapshotProcessor2.prototype, "isValidSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(value, context) {
        var processedSn = this.preProcessSnapshotSafe(value);
        if (processedSn === $preProcessorFailed) {
          return typeCheckFailure(context, value, "Failed to preprocess value");
        }
        return this._subtype.validate(processedSn, context);
      }
    });
    Object.defineProperty(SnapshotProcessor2.prototype, "getSubTypes", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        return this._subtype;
      }
    });
    Object.defineProperty(SnapshotProcessor2.prototype, "is", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(thing) {
        var value = isType(thing) ? this._subtype : isStateTreeNode(thing) ? thing : this.preProcessSnapshotSafe(thing);
        if (value === $preProcessorFailed) {
          return false;
        }
        return this._subtype.validate(value, [{ path: "", type: this._subtype }]).length === 0;
      }
    });
    Object.defineProperty(SnapshotProcessor2.prototype, "isAssignableFrom", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(type) {
        return this._subtype.isAssignableFrom(type);
      }
    });
    Object.defineProperty(SnapshotProcessor2.prototype, "isMatchingSnapshotId", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(current, snapshot) {
        if (!(this._subtype instanceof ComplexType)) {
          return false;
        }
        var processedSn = this.preProcessSnapshot(snapshot);
        return this._subtype.isMatchingSnapshotId(current, processedSn);
      }
    });
    return SnapshotProcessor2;
  })(BaseType)
);
function proxyNodeTypeMethods(nodeType, snapshotProcessorType) {
  var e_1, _a2;
  var methods = [];
  for (var _i = 2; _i < arguments.length; _i++) {
    methods[_i - 2] = arguments[_i];
  }
  try {
    for (var methods_1 = __values(methods), methods_1_1 = methods_1.next(); !methods_1_1.done; methods_1_1 = methods_1.next()) {
      var method = methods_1_1.value;
      nodeType[method] = snapshotProcessorType[method].bind(snapshotProcessorType);
    }
  } catch (e_1_1) {
    e_1 = { error: e_1_1 };
  } finally {
    try {
      if (methods_1_1 && !methods_1_1.done && (_a2 = methods_1.return)) _a2.call(methods_1);
    } finally {
      if (e_1) throw e_1.error;
    }
  }
}
function snapshotProcessor(type, processors, name) {
  assertIsType(type, 1);
  if (devMode()) {
    if (processors.postProcessor && typeof processors.postProcessor !== "function") {
      throw new MstError("postSnapshotProcessor must be a function");
    }
    if (processors.preProcessor && typeof processors.preProcessor !== "function") {
      throw new MstError("preSnapshotProcessor must be a function");
    }
  }
  return new SnapshotProcessor(type, processors, name);
}
var needsIdentifierError = "Map.put can only be used to store complex values that have an identifier type attribute";
function tryCollectModelTypes(type, modelTypes) {
  var e_1, _a2;
  var subtypes = type.getSubTypes();
  if (subtypes === cannotDetermineSubtype) {
    return false;
  }
  if (subtypes) {
    var subtypesArray = asArray(subtypes);
    try {
      for (var subtypesArray_1 = __values(subtypesArray), subtypesArray_1_1 = subtypesArray_1.next(); !subtypesArray_1_1.done; subtypesArray_1_1 = subtypesArray_1.next()) {
        var subtype = subtypesArray_1_1.value;
        if (!tryCollectModelTypes(subtype, modelTypes))
          return false;
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (subtypesArray_1_1 && !subtypesArray_1_1.done && (_a2 = subtypesArray_1.return)) _a2.call(subtypesArray_1);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
  }
  if (type instanceof ModelType) {
    modelTypes.push(type);
  }
  return true;
}
var MapIdentifierMode;
(function(MapIdentifierMode2) {
  MapIdentifierMode2[MapIdentifierMode2["UNKNOWN"] = 0] = "UNKNOWN";
  MapIdentifierMode2[MapIdentifierMode2["YES"] = 1] = "YES";
  MapIdentifierMode2[MapIdentifierMode2["NO"] = 2] = "NO";
})(MapIdentifierMode || (MapIdentifierMode = {}));
var MSTMap = (
  /** @class */
  (function(_super) {
    __extends(MSTMap2, _super);
    function MSTMap2(initialData, name) {
      return _super.call(this, initialData, observable.ref.enhancer, name) || this;
    }
    Object.defineProperty(MSTMap2.prototype, "get", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(key) {
        return _super.prototype.get.call(this, "" + key);
      }
    });
    Object.defineProperty(MSTMap2.prototype, "has", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(key) {
        return _super.prototype.has.call(this, "" + key);
      }
    });
    Object.defineProperty(MSTMap2.prototype, "delete", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(key) {
        return _super.prototype.delete.call(this, "" + key);
      }
    });
    Object.defineProperty(MSTMap2.prototype, "set", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(key, value) {
        return _super.prototype.set.call(this, "" + key, value);
      }
    });
    Object.defineProperty(MSTMap2.prototype, "put", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(value) {
        if (!value)
          throw new MstError("Map.put cannot be used to set empty values");
        if (isStateTreeNode(value)) {
          var node = getStateTreeNode(value);
          if (devMode()) {
            if (!node.identifierAttribute) {
              throw new MstError(needsIdentifierError);
            }
          }
          if (node.identifier === null) {
            throw new MstError(needsIdentifierError);
          }
          this.set(node.identifier, value);
          return value;
        } else if (!isMutable(value)) {
          throw new MstError("Map.put can only be used to store complex values");
        } else {
          var mapNode = getStateTreeNode(this);
          var mapType = mapNode.type;
          if (mapType.identifierMode !== MapIdentifierMode.YES) {
            throw new MstError(needsIdentifierError);
          }
          var idAttr = mapType.mapIdentifierAttribute;
          var id = value[idAttr];
          if (!isValidIdentifier(id)) {
            var newNode = this.put(mapType.getChildType().create(value, mapNode.environment));
            return this.put(getSnapshot(newNode));
          }
          var key = normalizeIdentifier(id);
          this.set(key, value);
          return this.get(key);
        }
      }
    });
    return MSTMap2;
  })(ObservableMap)
);
var MapType = (
  /** @class */
  (function(_super) {
    __extends(MapType2, _super);
    function MapType2(name, _subType, hookInitializers) {
      if (hookInitializers === void 0) {
        hookInitializers = [];
      }
      var _this = _super.call(this, name) || this;
      Object.defineProperty(_this, "_subType", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: _subType
      });
      Object.defineProperty(_this, "identifierMode", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: MapIdentifierMode.UNKNOWN
      });
      Object.defineProperty(_this, "mapIdentifierAttribute", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(_this, "flags", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: TypeFlags.Map
      });
      Object.defineProperty(_this, "hookInitializers", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: []
      });
      _this._determineIdentifierMode();
      _this.hookInitializers = hookInitializers;
      return _this;
    }
    Object.defineProperty(MapType2.prototype, "hooks", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(hooks) {
        var hookInitializers = this.hookInitializers.length > 0 ? this.hookInitializers.concat(hooks) : [hooks];
        return new MapType2(this.name, this._subType, hookInitializers);
      }
    });
    Object.defineProperty(MapType2.prototype, "instantiate", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(parent, subpath, environment, initialValue) {
        this._determineIdentifierMode();
        return createObjectNode(this, parent, subpath, environment, initialValue);
      }
    });
    Object.defineProperty(MapType2.prototype, "_determineIdentifierMode", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        if (this.identifierMode !== MapIdentifierMode.UNKNOWN) {
          return;
        }
        var modelTypes = [];
        if (tryCollectModelTypes(this._subType, modelTypes)) {
          var identifierAttribute = modelTypes.reduce(function(current, type) {
            if (!type.identifierAttribute)
              return current;
            if (current && current !== type.identifierAttribute) {
              throw new MstError("The objects in a map should all have the same identifier attribute, expected '".concat(current, "', but child of type '").concat(type.name, "' declared attribute '").concat(type.identifierAttribute, "' as identifier"));
            }
            return type.identifierAttribute;
          }, void 0);
          if (identifierAttribute) {
            this.identifierMode = MapIdentifierMode.YES;
            this.mapIdentifierAttribute = identifierAttribute;
          } else {
            this.identifierMode = MapIdentifierMode.NO;
          }
        }
      }
    });
    Object.defineProperty(MapType2.prototype, "initializeChildNodes", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(objNode, initialSnapshot) {
        if (initialSnapshot === void 0) {
          initialSnapshot = {};
        }
        var subType = objNode.type._subType;
        var result = {};
        Object.keys(initialSnapshot).forEach(function(name) {
          result[name] = subType.instantiate(objNode, name, void 0, initialSnapshot[name]);
        });
        return result;
      }
    });
    Object.defineProperty(MapType2.prototype, "createNewInstance", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(childNodes) {
        return new MSTMap(childNodes, this.name);
      }
    });
    Object.defineProperty(MapType2.prototype, "finalizeNewInstance", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(node, instance) {
        interceptReads(instance, node.unbox);
        var type = node.type;
        type.hookInitializers.forEach(function(initializer) {
          var hooks = initializer(instance);
          Object.keys(hooks).forEach(function(name) {
            var hook = hooks[name];
            var actionInvoker = createActionInvoker(instance, name, hook);
            (!devMode() ? addHiddenFinalProp : addHiddenWritableProp)(instance, name, actionInvoker);
          });
        });
        intercept(instance, this.willChange);
        observe(instance, this.didChange);
      }
    });
    Object.defineProperty(MapType2.prototype, "describe", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        return this.name;
      }
    });
    Object.defineProperty(MapType2.prototype, "getChildren", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(node) {
        return values(node.storedValue);
      }
    });
    Object.defineProperty(MapType2.prototype, "getChildNode", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(node, key) {
        var childNode = node.storedValue.get("" + key);
        if (!childNode)
          throw new MstError("Not a child " + key);
        return childNode;
      }
    });
    Object.defineProperty(MapType2.prototype, "willChange", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(change) {
        var node = getStateTreeNode(change.object);
        var key = change.name;
        node.assertWritable({ subpath: key });
        var mapType = node.type;
        var subType = mapType._subType;
        switch (change.type) {
          case "update":
            {
              var newValue = change.newValue;
              var oldValue = change.object.get(key);
              if (newValue === oldValue)
                return null;
              typecheckInternal(subType, newValue);
              change.newValue = subType.reconcile(node.getChildNode(key), change.newValue, node, key);
              mapType.processIdentifier(key, change.newValue);
            }
            break;
          case "add":
            {
              typecheckInternal(subType, change.newValue);
              change.newValue = subType.instantiate(node, key, void 0, change.newValue);
              mapType.processIdentifier(key, change.newValue);
            }
            break;
        }
        return change;
      }
    });
    Object.defineProperty(MapType2.prototype, "processIdentifier", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(expected, node) {
        if (this.identifierMode === MapIdentifierMode.YES && node instanceof ObjectNode) {
          var identifier2 = node.identifier;
          if (identifier2 !== expected)
            throw new MstError("A map of objects containing an identifier should always store the object under their own identifier. Trying to store key '".concat(identifier2, "', but expected: '").concat(expected, "'"));
        }
      }
    });
    Object.defineProperty(MapType2.prototype, "getSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(node) {
        var res = {};
        node.getChildren().forEach(function(childNode) {
          res[childNode.subpath] = childNode.snapshot;
        });
        return res;
      }
    });
    Object.defineProperty(MapType2.prototype, "processInitialSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(childNodes) {
        var processed = {};
        Object.keys(childNodes).forEach(function(key) {
          processed[key] = childNodes[key].getSnapshot();
        });
        return processed;
      }
    });
    Object.defineProperty(MapType2.prototype, "didChange", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(change) {
        var node = getStateTreeNode(change.object);
        switch (change.type) {
          case "update":
            return void node.emitPatch({
              op: "replace",
              path: escapeJsonPath(change.name),
              value: change.newValue.snapshot,
              oldValue: change.oldValue ? change.oldValue.snapshot : void 0
            }, node);
          case "add":
            return void node.emitPatch({
              op: "add",
              path: escapeJsonPath(change.name),
              value: change.newValue.snapshot,
              oldValue: void 0
            }, node);
          case "delete":
            var oldSnapshot = change.oldValue.snapshot;
            change.oldValue.die();
            return void node.emitPatch({
              op: "remove",
              path: escapeJsonPath(change.name),
              oldValue: oldSnapshot
            }, node);
        }
      }
    });
    Object.defineProperty(MapType2.prototype, "applyPatchLocally", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(node, subpath, patch) {
        var target = node.storedValue;
        switch (patch.op) {
          case "add":
          case "replace":
            target.set(subpath, patch.value);
            break;
          case "remove":
            target.delete(subpath);
            break;
        }
      }
    });
    Object.defineProperty(MapType2.prototype, "applySnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(node, snapshot) {
        if (!isPlainObject(snapshot)) {
          typecheckInternal(this, snapshot);
          return;
        }
        var target = node.storedValue;
        var childType = this.getChildType();
        Array.from(target.keys()).forEach(function(key2) {
          if (!Object.prototype.hasOwnProperty.call(snapshot, key2)) {
            target.delete(key2);
            return;
          }
          var childNode = node.getChildNode(key2);
          var newValue = snapshot[key2];
          if (childNode.snapshot === newValue)
            return;
          if (canApplyDirectSnapshot(childType, childNode, newValue)) {
            childNode.applySnapshot(newValue);
          } else {
            target.set(key2, newValue);
          }
        });
        for (var key in snapshot) {
          if (!Object.prototype.hasOwnProperty.call(snapshot, key) || target.has(key))
            continue;
          target.set(key, snapshot[key]);
        }
      }
    });
    Object.defineProperty(MapType2.prototype, "getChildType", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        return this._subType;
      }
    });
    Object.defineProperty(MapType2.prototype, "isValidSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(value, context) {
        var _this = this;
        if (!isPlainObject(value)) {
          return typeCheckFailure(context, value, "Value is not a plain object");
        }
        return flattenTypeErrors(Object.keys(value).map(function(path) {
          return _this._subType.validate(value[path], getContextForPath(context, path, _this._subType));
        }));
      }
    });
    Object.defineProperty(MapType2.prototype, "getDefaultSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        return EMPTY_OBJECT;
      }
    });
    Object.defineProperty(MapType2.prototype, "removeChild", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(node, subpath) {
        node.storedValue.delete(subpath);
      }
    });
    return MapType2;
  })(ComplexType)
);
MapType.prototype.applySnapshot = action(MapType.prototype.applySnapshot);
function map(subtype) {
  return new MapType("Map<string, ".concat(subtype.name, ">"), subtype);
}
function isMapType(type) {
  return isType(type) && (type.flags & TypeFlags.Map) > 0;
}
var ArrayType = (
  /** @class */
  (function(_super) {
    __extends(ArrayType2, _super);
    function ArrayType2(name, _subType, hookInitializers) {
      if (hookInitializers === void 0) {
        hookInitializers = [];
      }
      var _this = _super.call(this, name) || this;
      Object.defineProperty(_this, "_subType", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: _subType
      });
      Object.defineProperty(_this, "flags", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: TypeFlags.Array
      });
      Object.defineProperty(_this, "hookInitializers", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: []
      });
      _this.hookInitializers = hookInitializers;
      return _this;
    }
    Object.defineProperty(ArrayType2.prototype, "hooks", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(hooks) {
        var hookInitializers = this.hookInitializers.length > 0 ? this.hookInitializers.concat(hooks) : [hooks];
        return new ArrayType2(this.name, this._subType, hookInitializers);
      }
    });
    Object.defineProperty(ArrayType2.prototype, "instantiate", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(parent, subpath, environment, initialValue) {
        return createObjectNode(this, parent, subpath, environment, initialValue);
      }
    });
    Object.defineProperty(ArrayType2.prototype, "initializeChildNodes", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(objNode, snapshot) {
        if (snapshot === void 0) {
          snapshot = [];
        }
        var subType = objNode.type._subType;
        var result = {};
        snapshot.forEach(function(item, index) {
          var subpath = "" + index;
          result[subpath] = subType.instantiate(objNode, subpath, void 0, item);
        });
        return result;
      }
    });
    Object.defineProperty(ArrayType2.prototype, "createNewInstance", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(childNodes) {
        var options = __assign(__assign({}, mobxShallow), { name: this.name });
        return observable.array(convertChildNodesToArray(childNodes), options);
      }
    });
    Object.defineProperty(ArrayType2.prototype, "finalizeNewInstance", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(node, instance) {
        getAdministration(instance).dehancer = node.unbox;
        var type = node.type;
        type.hookInitializers.forEach(function(initializer) {
          var hooks = initializer(instance);
          Object.keys(hooks).forEach(function(name) {
            var hook = hooks[name];
            var actionInvoker = createActionInvoker(instance, name, hook);
            (!devMode() ? addHiddenFinalProp : addHiddenWritableProp)(instance, name, actionInvoker);
          });
        });
        intercept(instance, this.willChange);
        observe(instance, this.didChange);
      }
    });
    Object.defineProperty(ArrayType2.prototype, "describe", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        return this.name;
      }
    });
    Object.defineProperty(ArrayType2.prototype, "getChildren", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(node) {
        return node.storedValue.slice();
      }
    });
    Object.defineProperty(ArrayType2.prototype, "getChildNode", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(node, key) {
        var index = Number(key);
        if (index < node.storedValue.length)
          return node.storedValue[index];
        throw new MstError("Not a child: " + key);
      }
    });
    Object.defineProperty(ArrayType2.prototype, "willChange", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(change) {
        var node = getStateTreeNode(change.object);
        node.assertWritable({ subpath: "" + change.index });
        var subType = node.type._subType;
        var childNodes = node.getChildren();
        switch (change.type) {
          case "update":
            {
              if (change.newValue === change.object[change.index])
                return null;
              var updatedNodes = reconcileArrayChildren(node, subType, [childNodes[change.index]], [change.newValue], [change.index]);
              if (!updatedNodes) {
                return null;
              }
              change.newValue = updatedNodes[0];
            }
            break;
          case "splice":
            {
              var index_1 = change.index, removedCount = change.removedCount, added = change.added;
              var addedNodes = reconcileArrayChildren(node, subType, childNodes.slice(index_1, index_1 + removedCount), added, added.map(function(_, i2) {
                return index_1 + i2;
              }));
              if (!addedNodes) {
                return null;
              }
              change.added = addedNodes;
              for (var i = index_1 + removedCount; i < childNodes.length; i++) {
                childNodes[i].setParent(node, "" + (i + added.length - removedCount));
              }
            }
            break;
        }
        return change;
      }
    });
    Object.defineProperty(ArrayType2.prototype, "getSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(node) {
        return node.getChildren().map(function(childNode) {
          return childNode.snapshot;
        });
      }
    });
    Object.defineProperty(ArrayType2.prototype, "processInitialSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(childNodes) {
        var processed = [];
        Object.keys(childNodes).forEach(function(key) {
          processed.push(childNodes[key].getSnapshot());
        });
        return processed;
      }
    });
    Object.defineProperty(ArrayType2.prototype, "didChange", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(change) {
        var node = getStateTreeNode(change.object);
        switch (change.type) {
          case "update":
            return void node.emitPatch({
              op: "replace",
              path: "" + change.index,
              value: change.newValue.snapshot,
              oldValue: change.oldValue ? change.oldValue.snapshot : void 0
            }, node);
          case "splice":
            if (change.removedCount && change.addedCount === change.object.length) {
              return void node.emitPatch({
                op: "replace",
                path: "",
                value: node.snapshot,
                oldValue: change.removed.map(function(node2) {
                  return node2.snapshot;
                })
              }, node);
            }
            for (var i = change.removedCount - 1; i >= 0; i--)
              node.emitPatch({
                op: "remove",
                path: "" + (change.index + i),
                oldValue: change.removed[i].snapshot
              }, node);
            for (var i = 0; i < change.addedCount; i++)
              node.emitPatch({
                op: "add",
                path: "" + (change.index + i),
                value: change.added[i].snapshot,
                oldValue: void 0
              }, node);
            return;
        }
      }
    });
    Object.defineProperty(ArrayType2.prototype, "applyPatchLocally", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(node, subpath, patch) {
        var target = node.storedValue;
        var index = subpath === "-" ? target.length : Number(subpath);
        switch (patch.op) {
          case "replace":
            target[index] = patch.value;
            break;
          case "add":
            target.splice(index, 0, patch.value);
            break;
          case "remove":
            target.splice(index, 1);
            break;
        }
      }
    });
    Object.defineProperty(ArrayType2.prototype, "applySnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(node, snapshot) {
        if (!isArray(snapshot)) {
          typecheckInternal(this, snapshot);
          return;
        }
        var target = node.storedValue;
        var childNodes = node.getChildren();
        var oldLength = childNodes.length;
        var newLength = snapshot.length;
        var childType = this.getChildType();
        var minLength = Math.min(oldLength, newLength);
        var firstChangedIndex = findFirstChangedIndex(childNodes, snapshot, minLength);
        if (firstChangedIndex === oldLength && firstChangedIndex === newLength) {
          return;
        }
        if (oldLength !== newLength || node.hasPatchSubscribers()) {
          target.replace(snapshot);
          return;
        }
        if (canApplyDirectSnapshotsInRange(childType, childNodes, snapshot, firstChangedIndex)) {
          applyDirectSnapshotsInRange(childNodes, snapshot, firstChangedIndex);
          return;
        }
        var oldEnd = oldLength - 1;
        var newEnd = newLength - 1;
        while (oldEnd >= firstChangedIndex && newEnd >= firstChangedIndex && childNodes[oldEnd].snapshot === snapshot[newEnd]) {
          oldEnd--;
          newEnd--;
        }
        var replacedCount = oldEnd >= firstChangedIndex ? oldEnd - firstChangedIndex + 1 : 0;
        var replacementSnapshots = newEnd >= firstChangedIndex ? snapshot.slice(firstChangedIndex, newEnd + 1) : EMPTY_ARRAY;
        if (replacedCount === 1 && replacementSnapshots.length === 1) {
          target[firstChangedIndex] = replacementSnapshots[0];
          return;
        }
        target.splice.apply(target, __spreadArray([firstChangedIndex, replacedCount], __read(replacementSnapshots), false));
      }
    });
    Object.defineProperty(ArrayType2.prototype, "getChildType", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        return this._subType;
      }
    });
    Object.defineProperty(ArrayType2.prototype, "isValidSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(value, context) {
        var _this = this;
        if (!isArray(value)) {
          return typeCheckFailure(context, value, "Value is not an array");
        }
        return flattenTypeErrors(value.map(function(item, index) {
          return _this._subType.validate(item, getContextForPath(context, "" + index, _this._subType));
        }));
      }
    });
    Object.defineProperty(ArrayType2.prototype, "getDefaultSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        return EMPTY_ARRAY;
      }
    });
    Object.defineProperty(ArrayType2.prototype, "removeChild", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(node, subpath) {
        node.storedValue.splice(Number(subpath), 1);
      }
    });
    return ArrayType2;
  })(ComplexType)
);
ArrayType.prototype.applySnapshot = action(ArrayType.prototype.applySnapshot);
function array(subtype) {
  assertIsType(subtype, 1);
  return new ArrayType("".concat(subtype.name, "[]"), subtype);
}
function findFirstChangedIndex(childNodes, snapshot, length) {
  var index = 0;
  while (index < length && childNodes[index].snapshot === snapshot[index]) {
    index++;
  }
  return index;
}
function canApplyDirectSnapshotsInRange(childType, childNodes, snapshot, startIndex) {
  for (var i = startIndex; i < childNodes.length; i++) {
    if (childNodes[i].snapshot === snapshot[i])
      continue;
    if (!canApplyDirectSnapshot(childType, childNodes[i], snapshot[i])) {
      return false;
    }
  }
  return true;
}
function applyDirectSnapshotsInRange(childNodes, snapshot, startIndex) {
  for (var i = startIndex; i < childNodes.length; i++) {
    var childNode = childNodes[i];
    if (childNode.snapshot === snapshot[i])
      continue;
    childNode.applySnapshot(snapshot[i]);
  }
}
function reconcileArrayChildren(parent, childType, oldNodes, newValues, newPaths) {
  var nothingChanged = true;
  for (var i = 0; ; i++) {
    var hasNewNode = i <= newValues.length - 1;
    var oldNode = oldNodes[i];
    var newValue = hasNewNode ? newValues[i] : void 0;
    var newPath = "" + newPaths[i];
    if (isNode(newValue))
      newValue = newValue.storedValue;
    if (!oldNode && !hasNewNode) {
      break;
    } else if (!hasNewNode) {
      nothingChanged = false;
      oldNodes.splice(i, 1);
      if (oldNode instanceof ObjectNode) {
        oldNode.createObservableInstanceIfNeeded();
      }
      oldNode.die();
      i--;
    } else if (!oldNode) {
      if (isStateTreeNode(newValue) && getStateTreeNode(newValue).parent === parent) {
        throw new MstError("Cannot add an object to a state tree if it is already part of the same or another state tree. Tried to assign an object to '".concat(parent.path, "/").concat(newPath, "', but it lives already at '").concat(getStateTreeNode(newValue).path, "'"));
      }
      nothingChanged = false;
      var newNode = valueAsNode(childType, parent, newPath, newValue);
      oldNodes.splice(i, 0, newNode);
    } else if (areSame(oldNode, newValue)) {
      oldNodes[i] = valueAsNode(childType, parent, newPath, newValue, oldNode);
    } else {
      var oldMatch = void 0;
      for (var j = i; j < oldNodes.length; j++) {
        if (areSame(oldNodes[j], newValue)) {
          oldMatch = oldNodes.splice(j, 1)[0];
          break;
        }
      }
      nothingChanged = false;
      var newNode = valueAsNode(childType, parent, newPath, newValue, oldMatch);
      oldNodes.splice(i, 0, newNode);
    }
  }
  return nothingChanged ? null : oldNodes;
}
function valueAsNode(childType, parent, subpath, newValue, oldNode) {
  typecheckInternal(childType, newValue);
  function getNewNode() {
    if (isStateTreeNode(newValue)) {
      var childNode = getStateTreeNode(newValue);
      childNode.assertAlive(EMPTY_OBJECT);
      if (childNode.parent !== null && childNode.parent === parent) {
        childNode.setParent(parent, subpath);
        return childNode;
      }
    }
    if (oldNode) {
      return childType.reconcile(oldNode, newValue, parent, subpath);
    }
    return childType.instantiate(parent, subpath, void 0, newValue);
  }
  var newNode = getNewNode();
  if (oldNode && oldNode !== newNode) {
    if (oldNode instanceof ObjectNode) {
      oldNode.createObservableInstanceIfNeeded();
    }
    oldNode.die();
  }
  return newNode;
}
function areSame(oldNode, newValue) {
  if (!oldNode.isAlive) {
    return false;
  }
  if (isStateTreeNode(newValue)) {
    var newNode = getStateTreeNode(newValue);
    return newNode.isAlive && newNode === oldNode;
  }
  if (oldNode.snapshot === newValue) {
    return true;
  }
  if (!(oldNode instanceof ObjectNode)) {
    return false;
  }
  var oldNodeType = oldNode.getReconciliationType();
  return oldNode.identifier !== null && oldNode.identifierAttribute && isPlainObject(newValue) && oldNodeType.is(newValue) && oldNodeType.isMatchingSnapshotId(oldNode, newValue);
}
function isArrayType(type) {
  return isType(type) && (type.flags & TypeFlags.Array) > 0;
}
var PRE_PROCESS_SNAPSHOT = "preProcessSnapshot";
var POST_PROCESS_SNAPSHOT = "postProcessSnapshot";
function objectTypeToString() {
  return getStateTreeNode(this).toString();
}
var defaultObjectOptions = {
  name: "AnonymousModel",
  properties: {},
  initializers: EMPTY_ARRAY
};
function toPropertiesObject(declaredProps) {
  var keysList = Object.keys(declaredProps);
  var alreadySeenKeys = /* @__PURE__ */ new Set();
  keysList.forEach(function(key) {
    if (alreadySeenKeys.has(key)) {
      throw new MstError("".concat(key, " is declared twice in the model. Model should not contain the same keys"));
    }
    alreadySeenKeys.add(key);
  });
  return keysList.reduce(function(props, key) {
    if (key in Hook) {
      throw new MstError("Hook '".concat(key, "' was defined as property. Hooks should be defined as part of the actions"));
    }
    var descriptor = Object.getOwnPropertyDescriptor(declaredProps, key);
    if ("get" in descriptor) {
      throw new MstError("Getters are not supported as properties. Please use views instead");
    }
    var value = descriptor.value;
    if (value === null || value === void 0) {
      throw new MstError("The default value of an attribute cannot be null or undefined as the type cannot be inferred. Did you mean `types.maybe(someType)`?");
    } else if (isPrimitive(value)) {
      props[key] = optional(getPrimitiveFactoryFromValue(value), value);
    } else if (value instanceof MapType) {
      props[key] = optional(value, {});
    } else if (value instanceof ArrayType) {
      props[key] = optional(value, []);
    } else if (isType(value)) ;
    else if (devMode() && typeof value === "function") {
      throw new MstError("Invalid type definition for property '".concat(key, "', it looks like you passed a function. Did you forget to invoke it, or did you intend to declare a view / action?"));
    } else if (devMode() && typeof value === "object") {
      throw new MstError("Invalid type definition for property '".concat(key, "', it looks like you passed an object. Try passing another model type or a types.frozen."));
    } else {
      throw new MstError("Invalid type definition for property '".concat(key, "', cannot infer a type from a value like '").concat(value, "' (").concat(typeof value, ")"));
    }
    return props;
  }, __assign({}, declaredProps));
}
var ModelType = (
  /** @class */
  (function(_super) {
    __extends(ModelType2, _super);
    function ModelType2(opts) {
      var _this = _super.call(this, opts.name || defaultObjectOptions.name) || this;
      Object.defineProperty(_this, "flags", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: TypeFlags.Object
      });
      Object.defineProperty(_this, "initializers", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(_this, "properties", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(_this, "preProcessor", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(_this, "postProcessor", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(_this, "propertyNames", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(_this, "named", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: function(name) {
          return _this.cloneAndEnhance({ name });
        }
      });
      Object.defineProperty(_this, "props", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: function(properties) {
          return _this.cloneAndEnhance({ properties });
        }
      });
      Object.defineProperty(_this, "preProcessSnapshot", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: function(preProcessor) {
          var currentPreprocessor = _this.preProcessor;
          if (!currentPreprocessor)
            return _this.cloneAndEnhance({ preProcessor });
          else
            return _this.cloneAndEnhance({
              preProcessor: function(snapshot) {
                return currentPreprocessor(preProcessor(snapshot));
              }
            });
        }
      });
      Object.defineProperty(_this, "postProcessSnapshot", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: function(postProcessor) {
          var currentPostprocessor = _this.postProcessor;
          if (!currentPostprocessor)
            return _this.cloneAndEnhance({ postProcessor });
          else
            return _this.cloneAndEnhance({
              postProcessor: function(snapshot) {
                return postProcessor(currentPostprocessor(snapshot));
              }
            });
        }
      });
      Object.assign(_this, defaultObjectOptions, opts);
      _this.properties = toPropertiesObject(_this.properties);
      freeze(_this.properties);
      _this.propertyNames = Object.keys(_this.properties);
      _this.identifierAttribute = _this._getIdentifierAttribute();
      return _this;
    }
    Object.defineProperty(ModelType2.prototype, "_getIdentifierAttribute", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        var identifierAttribute = void 0;
        this.forAllProps(function(propName, propType) {
          if (propType.flags & TypeFlags.Identifier) {
            if (identifierAttribute)
              throw new MstError("Cannot define property '".concat(propName, "' as object identifier, property '").concat(identifierAttribute, "' is already defined as identifier property"));
            identifierAttribute = propName;
          }
        });
        return identifierAttribute;
      }
    });
    Object.defineProperty(ModelType2.prototype, "cloneAndEnhance", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(opts) {
        return new ModelType2({
          name: opts.name || this.name,
          properties: Object.assign({}, this.properties, opts.properties),
          initializers: this.initializers.concat(opts.initializers || []),
          preProcessor: opts.preProcessor || this.preProcessor,
          postProcessor: opts.postProcessor || this.postProcessor
        });
      }
    });
    Object.defineProperty(ModelType2.prototype, "actions", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(fn) {
        var _this = this;
        var actionInitializer = function(self) {
          _this.instantiateActions(self, fn(self));
          return self;
        };
        return this.cloneAndEnhance({ initializers: [actionInitializer] });
      }
    });
    Object.defineProperty(ModelType2.prototype, "instantiateActions", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(self, actions) {
        var _this = this;
        if (!isPlainObject(actions)) {
          throw new MstError("actions initializer should return a plain object containing actions");
        }
        Object.getOwnPropertyNames(actions).forEach(function(name) {
          if (name in _this.properties) {
            throw new MstError("'".concat(name, "' is a property and cannot be declared as an action"));
          }
          if (name === PRE_PROCESS_SNAPSHOT)
            throw new MstError("Cannot define action '".concat(PRE_PROCESS_SNAPSHOT, "', it should be defined using 'type.preProcessSnapshot(fn)' instead"));
          if (name === POST_PROCESS_SNAPSHOT)
            throw new MstError("Cannot define action '".concat(POST_PROCESS_SNAPSHOT, "', it should be defined using 'type.postProcessSnapshot(fn)' instead"));
          var action2 = actions[name];
          var baseAction = self[name];
          if (name in Hook && baseAction) {
            var specializedAction_1 = action2;
            action2 = function() {
              baseAction.apply(null, arguments);
              specializedAction_1.apply(null, arguments);
            };
          }
          var middlewares = action2.$mst_middleware;
          var boundAction = action2.bind(actions);
          boundAction._isFlowAction = action2._isFlowAction || false;
          boundAction.$mst_middleware = middlewares;
          var actionInvoker = createActionInvoker(self, name, boundAction);
          actions[name] = actionInvoker;
          (!devMode() ? addHiddenFinalProp : addHiddenWritableProp)(self, name, actionInvoker);
        });
      }
    });
    Object.defineProperty(ModelType2.prototype, "volatile", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(fn) {
        var _this = this;
        if (typeof fn !== "function") {
          throw new MstError("You passed an ".concat(typeof fn, " to volatile state as an argument, when function is expected"));
        }
        var stateInitializer = function(self) {
          _this.instantiateVolatileState(self, fn(self));
          return self;
        };
        return this.cloneAndEnhance({ initializers: [stateInitializer] });
      }
    });
    Object.defineProperty(ModelType2.prototype, "instantiateVolatileState", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(self, state) {
        var _this = this;
        if (!isPlainObject(state)) {
          throw new MstError("volatile state initializer should return a plain object containing state");
        }
        Object.getOwnPropertyNames(state).forEach(function(name) {
          if (name in _this.properties) {
            throw new MstError("'".concat(name, "' is a property and cannot be declared as volatile state"));
          }
          set(self, name, state[name]);
        });
      }
    });
    Object.defineProperty(ModelType2.prototype, "extend", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(fn) {
        var _this = this;
        var initializer = function(self) {
          var _a2 = fn(self), actions = _a2.actions, views = _a2.views, state = _a2.state, rest = __rest(_a2, ["actions", "views", "state"]);
          for (var key in rest)
            throw new MstError("The `extend` function should return an object with a subset of the fields 'actions', 'views' and 'state'. Found invalid key '".concat(key, "'"));
          if (state)
            _this.instantiateVolatileState(self, state);
          if (views)
            _this.instantiateViews(self, views);
          if (actions)
            _this.instantiateActions(self, actions);
          return self;
        };
        return this.cloneAndEnhance({ initializers: [initializer] });
      }
    });
    Object.defineProperty(ModelType2.prototype, "views", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(fn) {
        var _this = this;
        var viewInitializer = function(self) {
          _this.instantiateViews(self, fn(self));
          return self;
        };
        return this.cloneAndEnhance({ initializers: [viewInitializer] });
      }
    });
    Object.defineProperty(ModelType2.prototype, "instantiateViews", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(self, views) {
        var _this = this;
        if (!isPlainObject(views)) {
          throw new MstError("views initializer should return a plain object containing views");
        }
        Object.getOwnPropertyNames(views).forEach(function(name) {
          var _a2;
          if (name in _this.properties) {
            throw new MstError("'".concat(name, "' is a property and cannot be declared as a view"));
          }
          var descriptor = Object.getOwnPropertyDescriptor(views, name);
          if ("get" in descriptor) {
            apiDefineProperty(self, name, descriptor);
            makeObservable(self, (_a2 = {}, _a2[name] = computed, _a2));
          } else if (typeof descriptor.value === "function") {
            (!devMode() ? addHiddenFinalProp : addHiddenWritableProp)(self, name, descriptor.value);
          } else {
            throw new MstError("A view member should either be a function or getter based property");
          }
        });
      }
    });
    Object.defineProperty(ModelType2.prototype, "instantiate", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(parent, subpath, environment, initialValue) {
        var value = isStateTreeNode(initialValue) ? initialValue : this.applySnapshotPreProcessor(initialValue);
        return createObjectNode(this, parent, subpath, environment, value);
      }
    });
    Object.defineProperty(ModelType2.prototype, "initializeChildNodes", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(objNode, initialSnapshot) {
        if (initialSnapshot === void 0) {
          initialSnapshot = {};
        }
        var type = objNode.type;
        var result = {};
        type.forAllProps(function(name, childType) {
          result[name] = childType.instantiate(objNode, name, void 0, initialSnapshot[name]);
        });
        return result;
      }
    });
    Object.defineProperty(ModelType2.prototype, "createNewInstance", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(childNodes) {
        var options = __assign(__assign({}, mobxShallow), { name: this.name });
        return observable.object(childNodes, EMPTY_OBJECT, options);
      }
    });
    Object.defineProperty(ModelType2.prototype, "finalizeNewInstance", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(node, instance) {
        addHiddenFinalProp(instance, "toString", objectTypeToString);
        this.forAllProps(function(name) {
          interceptReads(instance, name, node.unbox);
        });
        this.initializers.reduce(function(self, fn) {
          return fn(self);
        }, instance);
        intercept(instance, this.willChange);
        observe(instance, this.didChange);
      }
    });
    Object.defineProperty(ModelType2.prototype, "willChange", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(chg) {
        var change = chg;
        var node = getStateTreeNode(change.object);
        var subpath = change.name;
        node.assertWritable({ subpath });
        var childType = node.type.properties[subpath];
        if (childType) {
          typecheckInternal(childType, change.newValue);
          change.newValue = childType.reconcile(node.getChildNode(subpath), change.newValue, node, subpath);
        }
        return change;
      }
    });
    Object.defineProperty(ModelType2.prototype, "didChange", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(chg) {
        var change = chg;
        var childNode = getStateTreeNode(change.object);
        var childType = childNode.type.properties[change.name];
        if (!childType) {
          return;
        }
        var oldChildValue = change.oldValue ? change.oldValue.snapshot : void 0;
        childNode.emitPatch({
          op: "replace",
          path: escapeJsonPath(change.name),
          value: change.newValue.snapshot,
          oldValue: oldChildValue
        }, childNode);
      }
    });
    Object.defineProperty(ModelType2.prototype, "getChildren", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(node) {
        var _this = this;
        var res = [];
        this.forAllProps(function(name) {
          res.push(_this.getChildNode(node, name));
        });
        return res;
      }
    });
    Object.defineProperty(ModelType2.prototype, "getChildNode", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(node, key) {
        var _a2;
        if (!(key in this.properties))
          throw new MstError("Not a value property: " + key);
        var adm = getAdministration(node.storedValue, key);
        var childNode = (_a2 = adm.raw) === null || _a2 === void 0 ? void 0 : _a2.call(adm);
        if (!childNode)
          throw new MstError("Node not available for property " + key);
        return childNode;
      }
    });
    Object.defineProperty(ModelType2.prototype, "getSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(node, applyPostProcess) {
        var _this = this;
        if (applyPostProcess === void 0) {
          applyPostProcess = true;
        }
        var res = {};
        this.forAllProps(function(name, type) {
          var atom = getAtom(node.storedValue, name);
          atom.reportObserved();
          res[name] = _this.getChildNode(node, name).snapshot;
        });
        if (applyPostProcess) {
          return this.applySnapshotPostProcessor(res);
        }
        return res;
      }
    });
    Object.defineProperty(ModelType2.prototype, "processInitialSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(childNodes) {
        var processed = {};
        Object.keys(childNodes).forEach(function(key) {
          processed[key] = childNodes[key].getSnapshot();
        });
        return this.applySnapshotPostProcessor(processed);
      }
    });
    Object.defineProperty(ModelType2.prototype, "applyPatchLocally", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(node, subpath, patch) {
        if (!(patch.op === "replace" || patch.op === "add")) {
          throw new MstError("object does not support operation ".concat(patch.op));
        }
        node.storedValue[subpath] = patch.value;
      }
    });
    Object.defineProperty(ModelType2.prototype, "applySnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(node, snapshot) {
        var preProcessedSnapshot = this.applySnapshotPreProcessor(snapshot);
        var isPreProcessedSnapshotNonPlain = !isPlainObject(preProcessedSnapshot);
        if (!isPlainObject(snapshot) || isPreProcessedSnapshotNonPlain) {
          typecheckInternal(this, snapshot);
          if (isPreProcessedSnapshotNonPlain)
            return;
        }
        this.forAllProps(function(name, childType) {
          var childNode = node.getChildNode(name);
          var newValue = preProcessedSnapshot[name];
          if (childNode.snapshot === newValue)
            return;
          if (canApplyDirectSnapshot(childType, childNode, newValue)) {
            childNode.applySnapshot(newValue);
            return;
          }
          node.storedValue[name] = newValue;
        });
      }
    });
    Object.defineProperty(ModelType2.prototype, "applySnapshotPreProcessor", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(snapshot) {
        var processor = this.preProcessor;
        return processor ? processor.call(null, snapshot) : snapshot;
      }
    });
    Object.defineProperty(ModelType2.prototype, "applySnapshotPostProcessor", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(snapshot) {
        var postProcessor = this.postProcessor;
        if (postProcessor)
          return postProcessor.call(null, snapshot);
        return snapshot;
      }
    });
    Object.defineProperty(ModelType2.prototype, "getChildType", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(propertyName) {
        assertIsString(propertyName, 1);
        return this.properties[propertyName];
      }
    });
    Object.defineProperty(ModelType2.prototype, "isValidSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(value, context) {
        var _this = this;
        var snapshot = this.applySnapshotPreProcessor(value);
        if (!isPlainObject(snapshot)) {
          return typeCheckFailure(context, snapshot, "Value is not a plain object");
        }
        return flattenTypeErrors(this.propertyNames.map(function(key) {
          return _this.properties[key].validate(snapshot[key], getContextForPath(context, key, _this.properties[key]));
        }));
      }
    });
    Object.defineProperty(ModelType2.prototype, "forAllProps", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(fn) {
        var _this = this;
        this.propertyNames.forEach(function(key) {
          return fn(key, _this.properties[key]);
        });
      }
    });
    Object.defineProperty(ModelType2.prototype, "describe", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        var _this = this;
        return "{ " + this.propertyNames.map(function(key) {
          return key + ": " + _this.properties[key].describe();
        }).join("; ") + " }";
      }
    });
    Object.defineProperty(ModelType2.prototype, "getDefaultSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        return EMPTY_OBJECT;
      }
    });
    Object.defineProperty(ModelType2.prototype, "removeChild", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(node, subpath) {
        node.storedValue[subpath] = void 0;
      }
    });
    return ModelType2;
  })(ComplexType)
);
ModelType.prototype.applySnapshot = action(ModelType.prototype.applySnapshot);
function model() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  if (devMode() && typeof args[0] !== "string" && args[1]) {
    throw new MstError("Model creation failed. First argument must be a string when two arguments are provided");
  }
  var name = typeof args[0] === "string" ? args.shift() : "AnonymousModel";
  var properties = args.shift() || {};
  return new ModelType({ name, properties });
}
function compose() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  var hasTypename = typeof args[0] === "string";
  var typeName = hasTypename ? args[0] : "AnonymousModel";
  if (hasTypename) {
    args.shift();
  }
  if (devMode()) {
    args.forEach(function(type, i) {
      assertArg(type, isModelType, "mobx-state-tree model type", hasTypename ? i + 2 : i + 1);
    });
  }
  return args.reduce(function(prev, cur) {
    return prev.cloneAndEnhance({
      name: prev.name + "_" + cur.name,
      properties: cur.properties,
      initializers: cur.initializers,
      preProcessor: function(snapshot) {
        return cur.applySnapshotPreProcessor(prev.applySnapshotPreProcessor(snapshot));
      },
      postProcessor: function(snapshot) {
        return cur.applySnapshotPostProcessor(prev.applySnapshotPostProcessor(snapshot));
      }
    });
  }).named(typeName);
}
function isModelType(type) {
  return isType(type) && (type.flags & TypeFlags.Object) > 0;
}
var CoreType = (
  /** @class */
  (function(_super) {
    __extends(CoreType2, _super);
    function CoreType2(name, flags, checker, initializer) {
      if (initializer === void 0) {
        initializer = identity;
      }
      var _this = _super.call(this, name) || this;
      Object.defineProperty(_this, "flags", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: flags
      });
      Object.defineProperty(_this, "checker", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: checker
      });
      Object.defineProperty(_this, "initializer", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: initializer
      });
      _this.flags = flags;
      return _this;
    }
    Object.defineProperty(CoreType2.prototype, "describe", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        return this.name;
      }
    });
    Object.defineProperty(CoreType2.prototype, "instantiate", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(parent, subpath, environment, initialValue) {
        return createScalarNode(this, parent, subpath, environment, initialValue);
      }
    });
    Object.defineProperty(CoreType2.prototype, "createNewInstance", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(snapshot) {
        return this.initializer(snapshot);
      }
    });
    Object.defineProperty(CoreType2.prototype, "isValidSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(value, context) {
        if (isPrimitive(value) && this.checker(value)) {
          return typeCheckSuccess();
        }
        var typeName = this.name === "Date" ? "Date or a unix milliseconds timestamp" : this.name;
        return typeCheckFailure(context, value, "Value is not a ".concat(typeName));
      }
    });
    return CoreType2;
  })(SimpleType)
);
var string = new CoreType("string", TypeFlags.String, function(v) {
  return typeof v === "string";
});
var number = new CoreType("number", TypeFlags.Number, function(v) {
  return typeof v === "number";
});
var integer = new CoreType("integer", TypeFlags.Integer, function(v) {
  return isInteger(v);
});
var float = new CoreType("float", TypeFlags.Float, function(v) {
  return isFloat(v);
});
var finite = new CoreType("finite", TypeFlags.Finite, function(v) {
  return isFinite(v);
});
var _BigIntPrimitive = new CoreType("bigint", TypeFlags.BigInt, function(v) {
  if (typeof v === "bigint") {
    return true;
  }
  if (typeof v === "string" || typeof v === "number") {
    try {
      BigInt(v);
      return true;
    } catch (_a2) {
    }
  }
  return false;
}, function(v) {
  return typeof v === "bigint" ? v : BigInt(v);
});
_BigIntPrimitive.getSnapshot = function(node) {
  return String(node.storedValue);
};
var bigint = _BigIntPrimitive;
var boolean = new CoreType("boolean", TypeFlags.Boolean, function(v) {
  return typeof v === "boolean";
});
var nullType = new CoreType("null", TypeFlags.Null, function(v) {
  return v === null;
});
var undefinedType = new CoreType("undefined", TypeFlags.Undefined, function(v) {
  return v === void 0;
});
var _DatePrimitive = new CoreType("Date", TypeFlags.Date, function(v) {
  return typeof v === "number" || v instanceof Date;
}, function(v) {
  return v instanceof Date ? v : new Date(v);
});
_DatePrimitive.getSnapshot = function(node) {
  return node.storedValue.getTime();
};
var DatePrimitive = _DatePrimitive;
function getPrimitiveFactoryFromValue(value) {
  switch (typeof value) {
    case "string":
      return string;
    case "number":
      return number;
    // In the future, isInteger(value) ? integer : number would be interesting, but would be too breaking for now
    case "boolean":
      return boolean;
    case "bigint":
      return bigint;
    case "object":
      if (value instanceof Date)
        return DatePrimitive;
  }
  throw new MstError("Cannot determine primitive type from value " + value);
}
function isPrimitiveType(type) {
  return isType(type) && (type.flags & (TypeFlags.String | TypeFlags.Number | TypeFlags.Integer | TypeFlags.Boolean | TypeFlags.Date | TypeFlags.BigInt)) > 0;
}
var Literal = (
  /** @class */
  (function(_super) {
    __extends(Literal2, _super);
    function Literal2(value) {
      var _this = _super.call(this, JSON.stringify(value)) || this;
      Object.defineProperty(_this, "value", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(_this, "flags", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: TypeFlags.Literal
      });
      _this.value = value;
      return _this;
    }
    Object.defineProperty(Literal2.prototype, "instantiate", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(parent, subpath, environment, initialValue) {
        return createScalarNode(this, parent, subpath, environment, initialValue);
      }
    });
    Object.defineProperty(Literal2.prototype, "describe", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        return JSON.stringify(this.value);
      }
    });
    Object.defineProperty(Literal2.prototype, "isValidSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(value, context) {
        if (isPrimitive(value) && value === this.value) {
          return typeCheckSuccess();
        }
        return typeCheckFailure(context, value, "Value is not a literal ".concat(JSON.stringify(this.value)));
      }
    });
    return Literal2;
  })(SimpleType)
);
function literal(value) {
  assertArg(value, isPrimitive, "primitive", 1);
  return new Literal(value);
}
function isLiteralType(type) {
  return isType(type) && (type.flags & TypeFlags.Literal) > 0;
}
var Refinement = (
  /** @class */
  (function(_super) {
    __extends(Refinement2, _super);
    function Refinement2(name, _subtype, _predicate, _message) {
      var _this = _super.call(this, name) || this;
      Object.defineProperty(_this, "_subtype", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: _subtype
      });
      Object.defineProperty(_this, "_predicate", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: _predicate
      });
      Object.defineProperty(_this, "_message", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: _message
      });
      return _this;
    }
    Object.defineProperty(Refinement2.prototype, "flags", {
      get: function() {
        return this._subtype.flags | TypeFlags.Refinement;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Refinement2.prototype, "describe", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        return this.name;
      }
    });
    Object.defineProperty(Refinement2.prototype, "instantiate", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(parent, subpath, environment, initialValue) {
        return this._subtype.instantiate(parent, subpath, environment, initialValue);
      }
    });
    Object.defineProperty(Refinement2.prototype, "isAssignableFrom", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(type) {
        return this._subtype.isAssignableFrom(type);
      }
    });
    Object.defineProperty(Refinement2.prototype, "isValidSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(value, context) {
        var subtypeErrors = this._subtype.validate(value, context);
        if (subtypeErrors.length > 0)
          return subtypeErrors;
        var snapshot = isStateTreeNode(value) ? getStateTreeNode(value).snapshot : value;
        if (!this._predicate(snapshot)) {
          return typeCheckFailure(context, value, this._message(value));
        }
        return typeCheckSuccess();
      }
    });
    Object.defineProperty(Refinement2.prototype, "reconcile", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(current, newValue, parent, subpath) {
        return this._subtype.reconcile(current, newValue, parent, subpath);
      }
    });
    Object.defineProperty(Refinement2.prototype, "getSubTypes", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        return this._subtype;
      }
    });
    return Refinement2;
  })(BaseType)
);
function refinement() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  var name = typeof args[0] === "string" ? args.shift() : isType(args[0]) ? args[0].name : null;
  var type = args[0];
  var predicate = args[1];
  var message = args[2] ? args[2] : function(v) {
    return "Value does not respect the refinement predicate";
  };
  assertIsType(type, [1, 2]);
  assertIsString(name, 1);
  assertIsFunction(predicate, [2, 3]);
  assertIsFunction(message, [3, 4]);
  return new Refinement(name, type, predicate, message);
}
function isRefinementType(type) {
  return isType(type) && (type.flags & TypeFlags.Refinement) > 0;
}
function enumeration(name, options) {
  var realOptions = typeof name === "string" ? options : name;
  if (devMode()) {
    realOptions.forEach(function(option, i) {
      assertIsString(option, i + 1);
    });
  }
  var type = union.apply(void 0, __spreadArray([], __read(realOptions.map(function(option) {
    return literal("" + option);
  })), false));
  if (typeof name === "string")
    type.name = name;
  return type;
}
var Union = (
  /** @class */
  (function(_super) {
    __extends(Union2, _super);
    function Union2(name, _types, options) {
      var _this = _super.call(this, name) || this;
      Object.defineProperty(_this, "_types", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: _types
      });
      Object.defineProperty(_this, "_dispatcher", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(_this, "_eager", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: true
      });
      options = __assign({ eager: true, dispatcher: void 0 }, options);
      _this._dispatcher = options.dispatcher;
      if (!options.eager)
        _this._eager = false;
      return _this;
    }
    Object.defineProperty(Union2.prototype, "flags", {
      get: function() {
        var result = TypeFlags.Union;
        this._types.forEach(function(type) {
          result |= type.flags;
        });
        return result;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Union2.prototype, "isAssignableFrom", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(type) {
        return this._types.some(function(subType) {
          return subType.isAssignableFrom(type);
        });
      }
    });
    Object.defineProperty(Union2.prototype, "describe", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        return "(" + this._types.map(function(factory) {
          return factory.describe();
        }).join(" | ") + ")";
      }
    });
    Object.defineProperty(Union2.prototype, "instantiate", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(parent, subpath, environment, initialValue) {
        var type = this.determineType(initialValue, void 0);
        if (!type)
          throw new MstError("No matching type for union " + this.describe());
        return type.instantiate(parent, subpath, environment, initialValue);
      }
    });
    Object.defineProperty(Union2.prototype, "reconcile", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(current, newValue, parent, subpath) {
        var type = this.determineType(newValue, current.getReconciliationType());
        if (!type)
          throw new MstError("No matching type for union " + this.describe());
        return type.reconcile(current, newValue, parent, subpath);
      }
    });
    Object.defineProperty(Union2.prototype, "determineType", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(value, reconcileCurrentType) {
        if (this._dispatcher) {
          return this._dispatcher(value);
        }
        if (reconcileCurrentType) {
          if (reconcileCurrentType.is(value)) {
            return reconcileCurrentType;
          }
          return this._types.filter(function(t) {
            return t !== reconcileCurrentType;
          }).find(function(type) {
            return type.is(value);
          });
        } else {
          return this._types.find(function(type) {
            return type.is(value);
          });
        }
      }
    });
    Object.defineProperty(Union2.prototype, "isValidSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(value, context) {
        if (this._dispatcher) {
          return this._dispatcher(value).validate(value, context);
        }
        var allErrors = [];
        var applicableTypes = 0;
        for (var i = 0; i < this._types.length; i++) {
          var type = this._types[i];
          var errors = type.validate(value, context);
          if (errors.length === 0) {
            if (this._eager)
              return typeCheckSuccess();
            else
              applicableTypes++;
          } else {
            allErrors.push(errors);
          }
        }
        if (applicableTypes === 1)
          return typeCheckSuccess();
        return typeCheckFailure(context, value, "No type is applicable for the union").concat(flattenTypeErrors(allErrors));
      }
    });
    Object.defineProperty(Union2.prototype, "getSubTypes", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        return this._types;
      }
    });
    return Union2;
  })(BaseType)
);
function union(optionsOrType) {
  var otherTypes = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    otherTypes[_i - 1] = arguments[_i];
  }
  var options = isType(optionsOrType) ? void 0 : optionsOrType;
  var types2 = isType(optionsOrType) ? __spreadArray([optionsOrType], __read(otherTypes), false) : otherTypes;
  var name = "(" + types2.map(function(type) {
    return type.name;
  }).join(" | ") + ")";
  if (devMode()) {
    if (options) {
      assertArg(options, function(o) {
        return isPlainObject(o);
      }, "object { eager?: boolean, dispatcher?: Function }", 1);
    }
    types2.forEach(function(type, i) {
      assertIsType(type, options ? i + 2 : i + 1);
    });
  }
  return new Union(name, types2, options);
}
function isUnionType(type) {
  return isType(type) && (type.flags & TypeFlags.Union) > 0;
}
var OptionalValue = (
  /** @class */
  (function(_super) {
    __extends(OptionalValue2, _super);
    function OptionalValue2(_subtype, _defaultValue, optionalValues) {
      var _this = _super.call(this, _subtype.name) || this;
      Object.defineProperty(_this, "_subtype", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: _subtype
      });
      Object.defineProperty(_this, "_defaultValue", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: _defaultValue
      });
      Object.defineProperty(_this, "optionalValues", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: optionalValues
      });
      return _this;
    }
    Object.defineProperty(OptionalValue2.prototype, "flags", {
      get: function() {
        return this._subtype.flags | TypeFlags.Optional;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(OptionalValue2.prototype, "describe", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        return this._subtype.describe() + "?";
      }
    });
    Object.defineProperty(OptionalValue2.prototype, "instantiate", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(parent, subpath, environment, initialValue) {
        if (this.optionalValues.indexOf(initialValue) >= 0) {
          var defaultInstanceOrSnapshot = this.getDefaultInstanceOrSnapshot();
          return this._subtype.instantiate(parent, subpath, environment, defaultInstanceOrSnapshot);
        }
        return this._subtype.instantiate(parent, subpath, environment, initialValue);
      }
    });
    Object.defineProperty(OptionalValue2.prototype, "reconcile", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(current, newValue, parent, subpath) {
        return this._subtype.reconcile(current, this.optionalValues.indexOf(newValue) < 0 && this._subtype.is(newValue) ? newValue : this.getDefaultInstanceOrSnapshot(), parent, subpath);
      }
    });
    Object.defineProperty(OptionalValue2.prototype, "getDefaultInstanceOrSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        var defaultInstanceOrSnapshot = typeof this._defaultValue === "function" ? this._defaultValue() : this._defaultValue;
        if (typeof this._defaultValue === "function") {
          typecheckInternal(this, defaultInstanceOrSnapshot);
        }
        return defaultInstanceOrSnapshot;
      }
    });
    Object.defineProperty(OptionalValue2.prototype, "isValidSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(value, context) {
        if (this.optionalValues.indexOf(value) >= 0) {
          return typeCheckSuccess();
        }
        return this._subtype.validate(value, context);
      }
    });
    Object.defineProperty(OptionalValue2.prototype, "isAssignableFrom", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(type) {
        return this._subtype.isAssignableFrom(type);
      }
    });
    Object.defineProperty(OptionalValue2.prototype, "getSubTypes", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        return this._subtype;
      }
    });
    return OptionalValue2;
  })(BaseType)
);
function checkOptionalPreconditions(type, defaultValueOrFunction) {
  if (typeof defaultValueOrFunction !== "function" && isStateTreeNode(defaultValueOrFunction)) {
    throw new MstError("default value cannot be an instance, pass a snapshot or a function that creates an instance/snapshot instead");
  }
  assertIsType(type, 1);
  if (devMode()) {
    if (typeof defaultValueOrFunction !== "function") {
      typecheckInternal(type, defaultValueOrFunction);
    }
  }
}
function optional(type, defaultValueOrFunction, optionalValues) {
  checkOptionalPreconditions(type, defaultValueOrFunction);
  return new OptionalValue(type, defaultValueOrFunction, optionalValues ? optionalValues : undefinedAsOptionalValues);
}
var undefinedAsOptionalValues = [void 0];
function isOptionalType(type) {
  return isType(type) && (type.flags & TypeFlags.Optional) > 0;
}
var optionalUndefinedType = optional(undefinedType, void 0);
var optionalNullType = optional(nullType, null);
function maybe(type) {
  assertIsType(type, 1);
  return union(type, optionalUndefinedType);
}
function maybeNull(type) {
  assertIsType(type, 1);
  return union(type, optionalNullType);
}
var Late = (
  /** @class */
  (function(_super) {
    __extends(Late2, _super);
    function Late2(name, _definition) {
      var _this = _super.call(this, name) || this;
      Object.defineProperty(_this, "_definition", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: _definition
      });
      Object.defineProperty(_this, "_subType", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      return _this;
    }
    Object.defineProperty(Late2.prototype, "flags", {
      get: function() {
        return (this._subType ? this._subType.flags : 0) | TypeFlags.Late;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Late2.prototype, "getSubType", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(mustSucceed) {
        if (!this._subType) {
          var t = void 0;
          try {
            t = this._definition();
          } catch (e) {
            if (e instanceof ReferenceError)
              t = void 0;
            else
              throw e;
          }
          if (mustSucceed && t === void 0)
            throw new MstError("Late type seems to be used too early, the definition (still) returns undefined");
          if (t) {
            if (devMode() && !isType(t))
              throw new MstError("Failed to determine subtype, make sure types.late returns a type definition.");
            this._subType = t;
          }
        }
        return this._subType;
      }
    });
    Object.defineProperty(Late2.prototype, "instantiate", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(parent, subpath, environment, initialValue) {
        return this.getSubType(true).instantiate(parent, subpath, environment, initialValue);
      }
    });
    Object.defineProperty(Late2.prototype, "reconcile", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(current, newValue, parent, subpath) {
        return this.getSubType(true).reconcile(current, newValue, parent, subpath);
      }
    });
    Object.defineProperty(Late2.prototype, "describe", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        var t = this.getSubType(false);
        return t ? t.name : "<uknown late type>";
      }
    });
    Object.defineProperty(Late2.prototype, "isValidSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(value, context) {
        var t = this.getSubType(false);
        if (!t) {
          return typeCheckSuccess();
        }
        return t.validate(value, context);
      }
    });
    Object.defineProperty(Late2.prototype, "isAssignableFrom", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(type) {
        var t = this.getSubType(false);
        return t ? t.isAssignableFrom(type) : false;
      }
    });
    Object.defineProperty(Late2.prototype, "getSubTypes", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        var subtype = this.getSubType(false);
        return subtype ? subtype : cannotDetermineSubtype;
      }
    });
    return Late2;
  })(BaseType)
);
function late(nameOrType, maybeType) {
  var name = typeof nameOrType === "string" ? nameOrType : "late(".concat(nameOrType.toString(), ")");
  var type = typeof nameOrType === "string" ? maybeType : nameOrType;
  if (devMode()) {
    if (!(typeof type === "function" && type.length === 0))
      throw new MstError("Invalid late type, expected a function with zero arguments that returns a type, got: " + type);
  }
  return new Late(name, type);
}
function isLateType(type) {
  return isType(type) && (type.flags & TypeFlags.Late) > 0;
}
function lazy(name, options) {
  return new Lazy(name, options);
}
var Lazy = (
  /** @class */
  (function(_super) {
    __extends(Lazy2, _super);
    function Lazy2(name, options) {
      var _this = _super.call(this, name) || this;
      Object.defineProperty(_this, "options", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: options
      });
      Object.defineProperty(_this, "flags", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: TypeFlags.Lazy
      });
      Object.defineProperty(_this, "loadedType", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: null
      });
      Object.defineProperty(_this, "pendingNodeList", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: observable.array()
      });
      when(function() {
        return _this.pendingNodeList.length > 0 && _this.pendingNodeList.some(function(node) {
          return node.isAlive && _this.options.shouldLoadPredicate(node.parent ? node.parent.value : null);
        });
      }, function() {
        _this.options.loadType().then(action(function(type) {
          _this.loadedType = type;
          _this.pendingNodeList.forEach(function(node) {
            if (!node.parent)
              return;
            if (!_this.loadedType)
              return;
            node.parent.applyPatches([
              {
                op: "replace",
                path: "/".concat(node.subpath),
                value: node.snapshot
              }
            ]);
          });
        }));
      });
      return _this;
    }
    Object.defineProperty(Lazy2.prototype, "describe", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        return "<lazy ".concat(this.name, ">");
      }
    });
    Object.defineProperty(Lazy2.prototype, "instantiate", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(parent, subpath, environment, value) {
        var _this = this;
        if (this.loadedType) {
          return this.loadedType.instantiate(parent, subpath, environment, value);
        }
        var node = createScalarNode(this, parent, subpath, environment, deepFreeze(value));
        this.pendingNodeList.push(node);
        when(function() {
          return !node.isAlive;
        }, function() {
          return _this.pendingNodeList.splice(_this.pendingNodeList.indexOf(node), 1);
        });
        return node;
      }
    });
    Object.defineProperty(Lazy2.prototype, "isValidSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(value, context) {
        if (this.loadedType) {
          return this.loadedType.validate(value, context);
        }
        if (!isSerializable(value)) {
          return typeCheckFailure(context, value, "Value is not serializable and cannot be lazy");
        }
        return typeCheckSuccess();
      }
    });
    Object.defineProperty(Lazy2.prototype, "reconcile", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(current, value, parent, subpath) {
        if (this.loadedType) {
          current.die();
          return this.loadedType.instantiate(parent, subpath, parent.environment, value);
        }
        return _super.prototype.reconcile.call(this, current, value, parent, subpath);
      }
    });
    return Lazy2;
  })(SimpleType)
);
var Frozen = (
  /** @class */
  (function(_super) {
    __extends(Frozen2, _super);
    function Frozen2(subType) {
      var _this = _super.call(this, subType ? "frozen(".concat(subType.name, ")") : "frozen") || this;
      Object.defineProperty(_this, "subType", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: subType
      });
      Object.defineProperty(_this, "flags", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: TypeFlags.Frozen
      });
      return _this;
    }
    Object.defineProperty(Frozen2.prototype, "describe", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        return "<any immutable value>";
      }
    });
    Object.defineProperty(Frozen2.prototype, "instantiate", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(parent, subpath, environment, value) {
        return createScalarNode(this, parent, subpath, environment, deepFreeze(value));
      }
    });
    Object.defineProperty(Frozen2.prototype, "isValidSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(value, context) {
        if (!isSerializable(value)) {
          return typeCheckFailure(context, value, "Value is not serializable and cannot be frozen");
        }
        if (this.subType)
          return this.subType.validate(value, context);
        return typeCheckSuccess();
      }
    });
    return Frozen2;
  })(SimpleType)
);
var untypedFrozenInstance = new Frozen();
function frozen(arg) {
  if (arguments.length === 0)
    return untypedFrozenInstance;
  else if (isType(arg))
    return new Frozen(arg);
  else
    return optional(untypedFrozenInstance, arg);
}
function isFrozenType(type) {
  return isType(type) && (type.flags & TypeFlags.Frozen) > 0;
}
function getInvalidationCause(hook) {
  switch (hook) {
    case Hook.beforeDestroy:
      return "destroy";
    case Hook.beforeDetach:
      return "detach";
    default:
      return void 0;
  }
}
var StoredReference = (
  /** @class */
  (function() {
    function StoredReference2(value, targetType) {
      Object.defineProperty(this, "targetType", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: targetType
      });
      Object.defineProperty(this, "identifier", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "node", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "resolvedReference", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      if (isValidIdentifier(value)) {
        this.identifier = value;
      } else if (isStateTreeNode(value)) {
        var targetNode = getStateTreeNode(value);
        if (!targetNode.identifierAttribute)
          throw new MstError("Can only store references with a defined identifier attribute.");
        var id = targetNode.unnormalizedIdentifier;
        if (id === null || id === void 0) {
          throw new MstError("Can only store references to tree nodes with a defined identifier.");
        }
        this.identifier = id;
      } else {
        throw new MstError("Can only store references to tree nodes or identifiers, got: '".concat(value, "'"));
      }
    }
    Object.defineProperty(StoredReference2.prototype, "updateResolvedReference", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(node) {
        var normalizedId = normalizeIdentifier(this.identifier);
        var root = node.root;
        var lastCacheModification = root.identifierCache.getLastCacheModificationPerId(normalizedId);
        if (!this.resolvedReference || this.resolvedReference.lastCacheModification !== lastCacheModification) {
          var targetType = this.targetType;
          var target = root.identifierCache.resolve(targetType, normalizedId);
          if (!target) {
            throw new InvalidReferenceError("[mobx-state-tree] Failed to resolve reference '".concat(this.identifier, "' to type '").concat(this.targetType.name, "' (from node: ").concat(node.path, ")"));
          }
          this.resolvedReference = {
            node: target,
            lastCacheModification
          };
        }
      }
    });
    Object.defineProperty(StoredReference2.prototype, "resolvedValue", {
      get: function() {
        this.updateResolvedReference(this.node);
        return this.resolvedReference.node.value;
      },
      enumerable: false,
      configurable: true
    });
    return StoredReference2;
  })()
);
var InvalidReferenceError = (
  /** @class */
  (function(_super) {
    __extends(InvalidReferenceError2, _super);
    function InvalidReferenceError2(m) {
      var _this = _super.call(this, m) || this;
      Object.setPrototypeOf(_this, InvalidReferenceError2.prototype);
      return _this;
    }
    return InvalidReferenceError2;
  })(Error)
);
var BaseReferenceType = (
  /** @class */
  (function(_super) {
    __extends(BaseReferenceType2, _super);
    function BaseReferenceType2(targetType, onInvalidated) {
      var _this = _super.call(this, "reference(".concat(targetType.name, ")")) || this;
      Object.defineProperty(_this, "targetType", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: targetType
      });
      Object.defineProperty(_this, "onInvalidated", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: onInvalidated
      });
      Object.defineProperty(_this, "flags", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: TypeFlags.Reference
      });
      return _this;
    }
    Object.defineProperty(BaseReferenceType2.prototype, "describe", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        return this.name;
      }
    });
    Object.defineProperty(BaseReferenceType2.prototype, "isAssignableFrom", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(type) {
        return this.targetType.isAssignableFrom(type);
      }
    });
    Object.defineProperty(BaseReferenceType2.prototype, "isValidSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(value, context) {
        return isValidIdentifier(value) ? typeCheckSuccess() : typeCheckFailure(context, value, "Value is not a valid identifier, which is a string, number or a bigint");
      }
    });
    Object.defineProperty(BaseReferenceType2.prototype, "fireInvalidated", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(cause, storedRefNode, referenceId, refTargetNode) {
        var storedRefParentNode = storedRefNode.parent;
        if (!storedRefParentNode || !storedRefParentNode.isAlive) {
          return;
        }
        var storedRefParentValue = storedRefParentNode.storedValue;
        if (!storedRefParentValue) {
          return;
        }
        this.onInvalidated({
          cause,
          parent: storedRefParentValue,
          invalidTarget: refTargetNode ? refTargetNode.storedValue : void 0,
          invalidId: referenceId,
          replaceRef: function(newRef) {
            applyPatch(storedRefNode.root.storedValue, {
              op: "replace",
              value: newRef,
              path: storedRefNode.path
            });
          },
          removeRef: function() {
            if (isModelType(storedRefParentNode.type)) {
              this.replaceRef(void 0);
            } else {
              applyPatch(storedRefNode.root.storedValue, {
                op: "remove",
                path: storedRefNode.path
              });
            }
          }
        });
      }
    });
    Object.defineProperty(BaseReferenceType2.prototype, "addTargetNodeWatcher", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(storedRefNode, referenceId) {
        var _this = this;
        var refTargetValue = this.getValue(storedRefNode);
        if (!refTargetValue) {
          return void 0;
        }
        var refTargetNode = getStateTreeNode(refTargetValue);
        var hookHandler = function(_, refTargetNodeHook) {
          var cause = getInvalidationCause(refTargetNodeHook);
          if (!cause) {
            return;
          }
          _this.fireInvalidated(cause, storedRefNode, referenceId, refTargetNode);
        };
        var refTargetDetachHookDisposer = refTargetNode.registerHook(Hook.beforeDetach, hookHandler);
        var refTargetDestroyHookDisposer = refTargetNode.registerHook(Hook.beforeDestroy, hookHandler);
        return function() {
          refTargetDetachHookDisposer();
          refTargetDestroyHookDisposer();
        };
      }
    });
    Object.defineProperty(BaseReferenceType2.prototype, "watchTargetNodeForInvalidations", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(storedRefNode, identifier2, customGetSet) {
        var _this = this;
        if (!this.onInvalidated) {
          return;
        }
        var onRefTargetDestroyedHookDisposer;
        storedRefNode.registerHook(Hook.beforeDestroy, function() {
          if (onRefTargetDestroyedHookDisposer) {
            onRefTargetDestroyedHookDisposer();
          }
        });
        var scheduleRetryAfterReconciliation = function() {
          var retry = function() {
            if (!storedRefNode.isAlive) {
              return;
            }
            if (_this.getSnapshot(storedRefNode) !== identifier2) {
              return;
            }
            startWatching(false);
          };
          if (getCurrentActionContext()) {
            storedRefNode.root.enqueueEndOfAction(retry);
          } else {
            setImmediateWithFallback(retry);
          }
        };
        var startWatching = function(sync) {
          if (onRefTargetDestroyedHookDisposer) {
            onRefTargetDestroyedHookDisposer();
          }
          var storedRefParentNode = storedRefNode.parent;
          var storedRefParentValue = storedRefParentNode && storedRefParentNode.storedValue;
          if (storedRefParentNode && storedRefParentNode.isAlive && storedRefParentValue) {
            var refTargetNodeExists = void 0;
            if (customGetSet) {
              refTargetNodeExists = !!customGetSet.get(identifier2, storedRefParentValue);
            } else {
              refTargetNodeExists = storedRefNode.root.identifierCache.has(_this.targetType, normalizeIdentifier(identifier2));
            }
            if (!refTargetNodeExists) {
              if (sync) {
                scheduleRetryAfterReconciliation();
              } else {
                _this.fireInvalidated("invalidSnapshotReference", storedRefNode, identifier2, null);
              }
            } else {
              onRefTargetDestroyedHookDisposer = _this.addTargetNodeWatcher(storedRefNode, identifier2);
            }
          }
        };
        if (storedRefNode.state === NodeLifeCycle.FINALIZED) {
          startWatching(true);
        } else {
          if (!storedRefNode.isRoot) {
            storedRefNode.root.registerHook(Hook.afterCreationFinalization, function() {
              if (storedRefNode.parent) {
                storedRefNode.parent.createObservableInstanceIfNeeded();
              }
            });
          }
          storedRefNode.registerHook(Hook.afterAttach, function() {
            startWatching(false);
          });
        }
      }
    });
    return BaseReferenceType2;
  })(SimpleType)
);
var IdentifierReferenceType = (
  /** @class */
  (function(_super) {
    __extends(IdentifierReferenceType2, _super);
    function IdentifierReferenceType2(targetType, onInvalidated) {
      return _super.call(this, targetType, onInvalidated) || this;
    }
    Object.defineProperty(IdentifierReferenceType2.prototype, "getValue", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(storedRefNode) {
        if (!storedRefNode.isAlive)
          return void 0;
        var storedRef = storedRefNode.storedValue;
        return storedRef.resolvedValue;
      }
    });
    Object.defineProperty(IdentifierReferenceType2.prototype, "getSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(storedRefNode) {
        var ref = storedRefNode.storedValue;
        return ref.identifier;
      }
    });
    Object.defineProperty(IdentifierReferenceType2.prototype, "instantiate", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(parent, subpath, environment, initialValue) {
        var identifier2 = isStateTreeNode(initialValue) ? getIdentifier(initialValue) : initialValue;
        var storedRef = new StoredReference(initialValue, this.targetType);
        var storedRefNode = createScalarNode(this, parent, subpath, environment, storedRef);
        storedRef.node = storedRefNode;
        this.watchTargetNodeForInvalidations(storedRefNode, identifier2, void 0);
        return storedRefNode;
      }
    });
    Object.defineProperty(IdentifierReferenceType2.prototype, "reconcile", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(current, newValue, parent, subpath) {
        if (!current.isDetaching && current.type === this) {
          var compareByValue = isStateTreeNode(newValue);
          var ref = current.storedValue;
          if (!compareByValue && ref.identifier === newValue || compareByValue && ref.resolvedValue === newValue) {
            current.setParent(parent, subpath);
            return current;
          }
        }
        var newNode = this.instantiate(parent, subpath, void 0, newValue);
        current.die();
        return newNode;
      }
    });
    return IdentifierReferenceType2;
  })(BaseReferenceType)
);
var CustomReferenceType = (
  /** @class */
  (function(_super) {
    __extends(CustomReferenceType2, _super);
    function CustomReferenceType2(targetType, options, onInvalidated) {
      var _this = _super.call(this, targetType, onInvalidated) || this;
      Object.defineProperty(_this, "options", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: options
      });
      return _this;
    }
    Object.defineProperty(CustomReferenceType2.prototype, "getValue", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(storedRefNode) {
        if (!storedRefNode.isAlive)
          return void 0;
        var referencedNode = this.options.get(storedRefNode.storedValue, storedRefNode.parent ? storedRefNode.parent.storedValue : null);
        return referencedNode;
      }
    });
    Object.defineProperty(CustomReferenceType2.prototype, "getSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(storedRefNode) {
        return storedRefNode.storedValue;
      }
    });
    Object.defineProperty(CustomReferenceType2.prototype, "instantiate", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(parent, subpath, environment, newValue) {
        var identifier2 = isStateTreeNode(newValue) ? this.options.set(newValue, parent ? parent.storedValue : null) : newValue;
        var storedRefNode = createScalarNode(this, parent, subpath, environment, identifier2);
        this.watchTargetNodeForInvalidations(storedRefNode, identifier2, this.options);
        return storedRefNode;
      }
    });
    Object.defineProperty(CustomReferenceType2.prototype, "reconcile", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(current, newValue, parent, subpath) {
        var newIdentifier = isStateTreeNode(newValue) ? this.options.set(newValue, current ? current.storedValue : null) : newValue;
        if (!current.isDetaching && current.type === this && current.storedValue === newIdentifier) {
          current.setParent(parent, subpath);
          return current;
        }
        var newNode = this.instantiate(parent, subpath, void 0, newIdentifier);
        current.die();
        return newNode;
      }
    });
    return CustomReferenceType2;
  })(BaseReferenceType)
);
function reference(subType, options) {
  assertIsType(subType, 1);
  if (devMode()) {
    if (arguments.length === 2 && typeof arguments[1] === "string") {
      throw new MstError("References with base path are no longer supported. Please remove the base path.");
    }
  }
  var getSetOptions = options ? options : void 0;
  var onInvalidated = options ? options.onInvalidated : void 0;
  if (getSetOptions && (getSetOptions.get || getSetOptions.set)) {
    if (devMode()) {
      if (!getSetOptions.get || !getSetOptions.set) {
        throw new MstError("reference options must either contain both a 'get' and a 'set' method or none of them");
      }
    }
    return new CustomReferenceType(subType, {
      get: getSetOptions.get,
      set: getSetOptions.set
    }, onInvalidated);
  } else {
    return new IdentifierReferenceType(subType, onInvalidated);
  }
}
function isReferenceType(type) {
  return isType(type) && (type.flags & TypeFlags.Reference) > 0;
}
function safeReference(subType, options) {
  var refType = reference(subType, __assign(__assign({}, options), { onInvalidated: function(ev) {
    if (options && options.onInvalidated) {
      options.onInvalidated(ev);
    }
    ev.removeRef();
  } }));
  if (options && options.acceptsUndefined === false) {
    return refType;
  } else {
    return maybe(refType);
  }
}
var BaseIdentifierType = (
  /** @class */
  (function(_super) {
    __extends(BaseIdentifierType2, _super);
    function BaseIdentifierType2(name, validType) {
      var _this = _super.call(this, name) || this;
      Object.defineProperty(_this, "validType", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: validType
      });
      Object.defineProperty(_this, "flags", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: TypeFlags.Identifier
      });
      return _this;
    }
    Object.defineProperty(BaseIdentifierType2.prototype, "instantiate", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(parent, subpath, environment, initialValue) {
        if (!parent || !(parent.type instanceof ModelType))
          throw new MstError("Identifier types can only be instantiated as direct child of a model type");
        return createScalarNode(this, parent, subpath, environment, initialValue);
      }
    });
    Object.defineProperty(BaseIdentifierType2.prototype, "reconcile", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(current, newValue, parent, subpath) {
        if (current.storedValue !== newValue)
          throw new MstError("Tried to change identifier from '".concat(current.storedValue, "' to '").concat(newValue, "'. Changing identifiers is not allowed."));
        current.setParent(parent, subpath);
        return current;
      }
    });
    Object.defineProperty(BaseIdentifierType2.prototype, "isValidSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(value, context) {
        if (typeof value !== this.validType) {
          return typeCheckFailure(context, value, "Value is not a valid ".concat(this.describe(), ", expected a ").concat(this.validType));
        }
        return typeCheckSuccess();
      }
    });
    return BaseIdentifierType2;
  })(SimpleType)
);
var IdentifierType = (
  /** @class */
  (function(_super) {
    __extends(IdentifierType2, _super);
    function IdentifierType2() {
      var _this = _super.call(this, "identifier", "string") || this;
      Object.defineProperty(_this, "flags", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: TypeFlags.Identifier
      });
      return _this;
    }
    Object.defineProperty(IdentifierType2.prototype, "describe", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        return "identifier";
      }
    });
    return IdentifierType2;
  })(BaseIdentifierType)
);
var IdentifierNumberType = (
  /** @class */
  (function(_super) {
    __extends(IdentifierNumberType2, _super);
    function IdentifierNumberType2() {
      return _super.call(this, "identifierNumber", "number") || this;
    }
    Object.defineProperty(IdentifierNumberType2.prototype, "getSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(node) {
        return node.storedValue;
      }
    });
    Object.defineProperty(IdentifierNumberType2.prototype, "describe", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        return "identifierNumber";
      }
    });
    return IdentifierNumberType2;
  })(BaseIdentifierType)
);
var identifier = new IdentifierType();
var identifierNumber = new IdentifierNumberType();
var IdentifierBigintType = (
  /** @class */
  (function(_super) {
    __extends(IdentifierBigintType2, _super);
    function IdentifierBigintType2() {
      var _this = _super.call(this, "identifierBigint") || this;
      Object.defineProperty(_this, "flags", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: TypeFlags.Identifier
      });
      return _this;
    }
    Object.defineProperty(IdentifierBigintType2.prototype, "createNewInstance", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(snapshot) {
        if (typeof snapshot === "bigint")
          return snapshot;
        return BigInt(snapshot);
      }
    });
    Object.defineProperty(IdentifierBigintType2.prototype, "instantiate", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(parent, subpath, environment, initialValue) {
        if (!parent || !(parent.type instanceof ModelType))
          throw new MstError("Identifier types can only be instantiated as direct child of a model type");
        return createScalarNode(this, parent, subpath, environment, initialValue);
      }
    });
    Object.defineProperty(IdentifierBigintType2.prototype, "reconcile", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(current, newValue, parent, subpath) {
        var currentVal = current.storedValue;
        var newVal = typeof newValue === "bigint" ? newValue : BigInt(newValue);
        if (currentVal !== newVal)
          throw new MstError("Tried to change identifier from '".concat(currentVal, "' to '").concat(newVal, "'. Changing identifiers is not allowed."));
        current.setParent(parent, subpath);
        return current;
      }
    });
    Object.defineProperty(IdentifierBigintType2.prototype, "isValidSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(value, context) {
        if (typeof value === "bigint") {
          return typeCheckSuccess();
        }
        if (typeof value === "string" || typeof value === "number") {
          try {
            BigInt(value);
            return typeCheckSuccess();
          } catch (e) {
            var errorMessage = e instanceof Error ? e.message : String(e);
            return typeCheckFailure(context, value, "Value is not a valid ".concat(this.describe(), ": ").concat(errorMessage));
          }
        }
        return typeCheckFailure(context, value, "Value is not a valid ".concat(this.describe(), ", expected a bigint, a string or a number"));
      }
    });
    Object.defineProperty(IdentifierBigintType2.prototype, "getSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(node) {
        return String(node.storedValue);
      }
    });
    Object.defineProperty(IdentifierBigintType2.prototype, "describe", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        return "identifierBigint";
      }
    });
    return IdentifierBigintType2;
  })(SimpleType)
);
var identifierBigint = new IdentifierBigintType();
function isIdentifierType(type) {
  return isType(type) && (type.flags & TypeFlags.Identifier) > 0;
}
function normalizeIdentifier(id) {
  return "" + id;
}
function isValidIdentifier(id) {
  return typeof id === "string" || typeof id === "number" || typeof id === "bigint";
}
function assertIsValidIdentifier(id, argNumber) {
  assertArg(id, isValidIdentifier, "string, number or bigint (identifier)", argNumber);
}
function custom(options) {
  return new CustomType(options);
}
var CustomType = (
  /** @class */
  (function(_super) {
    __extends(CustomType2, _super);
    function CustomType2(options) {
      var _this = _super.call(this, options.name) || this;
      Object.defineProperty(_this, "options", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: options
      });
      Object.defineProperty(_this, "flags", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: TypeFlags.Custom
      });
      return _this;
    }
    Object.defineProperty(CustomType2.prototype, "describe", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function() {
        return this.name;
      }
    });
    Object.defineProperty(CustomType2.prototype, "isValidSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(value, context) {
        if (this.options.isTargetType(value))
          return typeCheckSuccess();
        var typeError = this.options.getValidationMessage(value);
        if (typeError) {
          return typeCheckFailure(context, value, "Invalid value for type '".concat(this.name, "': ").concat(typeError));
        }
        return typeCheckSuccess();
      }
    });
    Object.defineProperty(CustomType2.prototype, "getSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(node) {
        return this.options.toSnapshot(node.storedValue);
      }
    });
    Object.defineProperty(CustomType2.prototype, "instantiate", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(parent, subpath, environment, initialValue) {
        var valueToStore = this.options.isTargetType(initialValue) ? initialValue : this.options.fromSnapshot(initialValue, parent && parent.root.environment);
        return createScalarNode(this, parent, subpath, environment, valueToStore);
      }
    });
    Object.defineProperty(CustomType2.prototype, "reconcile", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(current, value, parent, subpath) {
        var isSnapshot = !this.options.isTargetType(value);
        if (!current.isDetaching) {
          var unchanged = current.type === this && (isSnapshot ? value === current.snapshot : value === current.storedValue);
          if (unchanged) {
            current.setParent(parent, subpath);
            return current;
          }
        }
        var valueToStore = isSnapshot ? this.options.fromSnapshot(value, parent.root.environment) : value;
        var newNode = this.instantiate(parent, subpath, void 0, valueToStore);
        current.die();
        return newNode;
      }
    });
    return CustomType2;
  })(SimpleType)
);
var types = {
  enumeration,
  model,
  compose,
  custom,
  reference,
  safeReference,
  union,
  optional,
  literal,
  maybe,
  maybeNull,
  refinement,
  string,
  boolean,
  number,
  integer,
  float,
  finite,
  bigint,
  Date: DatePrimitive,
  map,
  array,
  frozen,
  identifier,
  identifierNumber,
  identifierBigint,
  late,
  lazy,
  undefined: undefinedType,
  null: nullType,
  snapshotProcessor
};
export {
  addDisposer,
  addMiddleware,
  applyAction,
  applyPatch,
  applySnapshot,
  cast,
  castFlowReturn,
  castToReferenceSnapshot,
  castToSnapshot,
  clone,
  createActionTrackingMiddleware,
  createActionTrackingMiddleware2,
  decorate,
  destroy,
  detach,
  escapeJsonPath,
  flow,
  getChildType,
  getEnv,
  getIdentifier,
  getLivelinessChecking,
  getMembers,
  getNodeId,
  getParent,
  getParentOfType,
  getPath,
  getPathParts,
  getPropertyMembers,
  getRelativePath,
  getRoot,
  getRunningActionContext,
  getSnapshot,
  getType,
  hasEnv,
  hasParent,
  hasParentOfType,
  isActionContextChildOf,
  isActionContextThisOrChildOf,
  isAlive,
  isArrayType,
  isFrozenType,
  isIdentifierType,
  isLateType,
  isLiteralType,
  isMapType,
  isModelType,
  isOptionalType,
  isPrimitiveType,
  isProtected,
  isReferenceType,
  isRefinementType,
  isRoot,
  isStateTreeNode,
  isType,
  isUnionType,
  isValidReference,
  joinJsonPath,
  onAction,
  onPatch,
  onSnapshot,
  process$1 as process,
  protect,
  recordActions,
  recordPatches,
  resolveIdentifier,
  resolvePath,
  setLivelinessChecking,
  setLivelynessChecking,
  splitJsonPath,
  types as t,
  toGenerator,
  toGeneratorFunction,
  tryReference,
  tryResolve,
  typecheck,
  types,
  unescapeJsonPath,
  unprotect,
  walk
};
//# sourceMappingURL=mobx-state-tree.js.map
