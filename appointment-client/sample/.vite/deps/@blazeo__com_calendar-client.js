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
  isObservableArray,
  isObservableObject,
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

// ../node_modules/@blazeo.com/calendar-client/node_modules/mobx-state-tree/dist/mobx-state-tree.module.js
var livelinessChecking = "warn";
function getLivelinessChecking() {
  return livelinessChecking;
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
function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++)
    ar = ar.concat(__read(arguments[i]));
  return ar;
}
function getType(object) {
  assertIsStateTreeNode(object, 1);
  return getStateTreeNode(object).type;
}
function applyPatch(target, patch) {
  assertIsStateTreeNode(target, 1);
  assertArg(patch, function(p) {
    return typeof p === "object";
  }, "object or array", 2);
  getStateTreeNode(target).applyPatches(asArray(patch));
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
function getRoot(target) {
  assertIsStateTreeNode(target, 1);
  return getStateTreeNode(target).root.storedValue;
}
function getPath(target) {
  assertIsStateTreeNode(target, 1);
  return getStateTreeNode(target).path;
}
function getIdentifier(target) {
  assertIsStateTreeNode(target, 1);
  return getStateTreeNode(target).identifier;
}
function getEnv(target) {
  assertIsStateTreeNode(target, 1);
  var node = getStateTreeNode(target);
  var env = node.root.environment;
  if (!env)
    return EMPTY_OBJECT;
  return env;
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
        var isAlive = this.isAlive;
        if (this.aliveAtom && wasAlive !== isAlive) {
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
            throw fail("assertion failed: cannot finalize the creation of a node that is already dead");
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
          throw fail("This scalar node is not part of a tree");
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
            throw fail("assertion failed: subpath expected");
          }
          if (!newParent) {
            throw fail("assertion failed: parent expected");
          }
          if (parentChanged) {
            throw fail("assertion failed: scalar nodes cannot change their parent");
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
        return this.type.name + "@" + path + (this.isAlive ? "" : " [dead]");
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
      Object.defineProperty(_this, "_observableInstanceState", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 0
        /* UNINITIALIZED */
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
        if (typeof id !== "string" && typeof id !== "number") {
          throw fail("Instance identifier '" + _this.identifierAttribute + "' for type '" + _this.type.name + "' must be a string or a number");
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
        if (this._observableInstanceState === 0) {
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
            throw fail("assertion failed: the creation of the observable instance must be done on the initializing phase");
          }
        }
        this._observableInstanceState = 1;
        var parentChain = [];
        var parent = this.parent;
        while (parent && parent._observableInstanceState === 0) {
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
        this._observableInstanceState = 2;
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
            throw fail("assertion failed: subpath expected");
          }
          if (!newParent) {
            throw fail("assertion failed: new parent expected");
          }
          if (this.parent && parentChanged) {
            throw fail("A node cannot exists twice in the state tree. Failed to add " + this + " to path '" + newParent.path + "/" + subpath + "'.");
          }
          if (!this.parent && newParent.root === this) {
            throw fail("A state tree is not allowed to contain itself. Cannot assign " + this + " to path '" + newParent.path + "/" + subpath + "'");
          }
          if (!this.parent && !!this.environment && this.environment !== newParent.root.environment) {
            throw fail("A state tree cannot be made part of another state tree as long as their environments are different.");
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
        return this._observableInstanceState === 2 ? this._getActualSnapshot() : this._getCachedInitialSnapshot();
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
              throw fail(error);
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
          actionFullPath = actionPath + "." + actionContext.name + "()";
        }
        return "You are trying to read or write to an object that is no longer part of a state tree. (Object type: '" + this.type.name + "', Path upon death: '" + escapedPath + "', Subpath: '" + subpath + "', Action: '" + actionFullPath + "'). Either detach nodes first, or don't use objects after removing / replacing them in the tree.";
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
          return this._observableInstanceState === 2 ? this.type.getChildNode(this, subpath) : this._childNodes[subpath];
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
          return this._observableInstanceState === 2 ? this.type.getChildren(this) : convertChildNodesToArray(this._childNodes);
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
          throw fail("Cannot modify '" + this + "', the object is protected and can only be modified by using an action.");
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
        var identifier2 = this.identifier ? "(id: " + this.identifier + ")" : "";
        return this.type.name + "@" + path + identifier2 + (this.isAlive ? "" : " [dead]");
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
          throw fail("Error while detaching, node is not alive.");
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
        if (this._observableInstanceState === 0) {
          return;
        }
        this.getChildren().forEach(function(node) {
          node.aboutToDie();
        });
        this.baseAboutToDie();
        this._internalEventsEmit(
          "dispose"
          /* Dispose */
        );
        this._internalEventsClear(
          "dispose"
          /* Dispose */
        );
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
        return this._internalEventsRegister("snapshot", onChange);
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "emitSnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(snapshot) {
        this._internalEventsEmit("snapshot", snapshot);
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "onPatch", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(handler) {
        return this._internalEventsRegister("patch", handler);
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "emitPatch", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(basePatch, source) {
        if (this._internalEventsHasSubscribers(
          "patch"
          /* Patch */
        )) {
          var localizedPatch = extend({}, basePatch, {
            path: source.path.substr(this.path.length) + "/" + basePatch.path
            // calculate the relative path of the patch
          });
          var _a2 = __read(splitPatch(localizedPatch), 2), patch = _a2[0], reversePatch = _a2[1];
          this._internalEventsEmit("patch", patch, reversePatch);
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
        return this._internalEventsHas("dispose", disposer);
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "addDisposer", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(disposer) {
        if (!this.hasDisposer(disposer)) {
          this._internalEventsRegister("dispose", disposer, true);
          return;
        }
        throw fail("cannot add a disposer when it is already registered for execution");
      }
    });
    Object.defineProperty(ObjectNode2.prototype, "removeDisposer", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(disposer) {
        if (!this._internalEventsHas("dispose", disposer)) {
          throw fail("cannot remove a disposer which was never registered for execution");
        }
        this._internalEventsUnregister("dispose", disposer);
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
          (_a2 = this._internalEvents).emit.apply(_a2, __spread([event], args));
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
        throw fail("unimplemented method");
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
        throw fail("Factory.Type should not be actually called. It is just a Type signature that can be used at compile time with Typescript, by using `typeof type.Type`");
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BaseType2.prototype, "TypeWithoutSTN", {
      get: function() {
        throw fail("Factory.TypeWithoutSTN should not be actually called. It is just a Type signature that can be used at compile time with Typescript, by using `typeof type.TypeWithoutSTN`");
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BaseType2.prototype, "SnapshotType", {
      get: function() {
        throw fail("Factory.SnapshotType should not be actually called. It is just a Type signature that can be used at compile time with Typescript, by using `typeof type.SnapshotType`");
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(BaseType2.prototype, "CreationType", {
      get: function() {
        throw fail("Factory.CreationType should not be actually called. It is just a Type signature that can be used at compile time with Typescript, by using `typeof type.CreationType`");
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
function isType(value) {
  return typeof value === "object" && value && value.isType === true;
}
function assertIsType(type, argNumber) {
  assertArg(type, isType, "mobx-state-tree type", argNumber);
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
  currentActionContext = context;
  try {
    return runMiddleWares(node, context, fn);
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
      allParentIds: parentContext ? __spread(parentContext.allParentIds, [parentContext.id]) : [],
      parentEvent: parentContext,
      parentActionEvent: parentActionContext
    }, fn);
  };
  res._isMSTAction = true;
  res._isFlowAction = fn._isFlowAction;
  return res;
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
function runMiddleWares(node, baseCall, originalFn) {
  var middlewares = new CollectedMiddlewares(node, originalFn);
  if (middlewares.isEmpty)
    return action(originalFn).apply(null, baseCall.args);
  var result = null;
  function runNextMiddleware(call) {
    var middleware = middlewares.getNextMiddleware();
    var handler = middleware && middleware.handler;
    if (!handler) {
      return action(originalFn).apply(null, call.args);
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
        throw fail("Neither the next() nor the abort() callback within the middleware " + handler.name + ' for the action: "' + call.name + '" on the node: ' + node2.type.name + " was invoked.");
      } else if (nextInvoked && abortInvoked) {
        var node2 = getStateTreeNode(call.tree);
        throw fail("The next() and abort() callback within the middleware " + handler.name + ' for the action: "' + call.name + '" on the node: ' + node2.type.name + " were invoked.");
      }
    }
    return result;
  }
  return runNextMiddleware(baseCall);
}
function safeStringify(value) {
  try {
    return JSON.stringify(value);
  } catch (e) {
    return "<Unserializable: " + e + ">";
  }
}
function prettyPrintValue(value) {
  return typeof value === "function" ? "<function" + (value.name ? " " + value.name : "") + ">" : isStateTreeNode(value) ? "<" + value + ">" : "`" + safeStringify(value) + "`";
}
function shortenPrintValue(valueInString) {
  return valueInString.length < 280 ? valueInString : valueInString.substring(0, 272) + "......" + valueInString.substring(valueInString.length - 8);
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
  var pathPrefix = fullPath.length > 0 ? 'at path "/' + fullPath + '" ' : "";
  var currentTypename = isStateTreeNode(value) ? "value of type " + getStateTreeNode(value).type.name + ":" : isPrimitive(value) ? "value" : "snapshot";
  var isSnapshotCompatible = type && isStateTreeNode(value) && type.is(getStateTreeNode(value).snapshot);
  return "" + pathPrefix + currentTypename + " " + prettyPrintValue(value) + " is not assignable " + (type ? "to type: `" + type.name + "`" : "") + (error.message ? " (" + error.message + ")" : "") + (type ? isPrimitiveType(type) || isPrimitive(value) ? "." : ", expected an instance of `" + type.name + "` or a snapshot like `" + type.describe() + "` instead." + (isSnapshotCompatible ? " (Note that a snapshot of the provided value is compatible with the targeted type)" : "") : ".");
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
    throw fail(validationErrorsToString(type, value, errors));
  }
}
function validationErrorsToString(type, value, errors) {
  if (errors.length === 0) {
    return void 0;
  }
  return "Error while converting " + shortenPrintValue(prettyPrintValue(value)) + " to `" + type.name + "`:\n\n    " + errors.map(toErrorString).join("\n    ");
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
        return this.cacheId + "-" + modificationId;
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
            throw fail("Already registered");
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
            throw fail("Cannot resolve a reference to type '" + type.name + "' with id: '" + identifier2 + "' unambigously, there are multiple candidates: " + matches.map(function(n) {
              return n.path;
            }).join(", "));
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
      throw fail("Cannot add an object to a state tree if it is already part of the same or another state tree. Tried to assign an object to '" + (parent ? parent.path : "") + "/" + subpath + "', but it lives already at '" + existingNode.path + "'");
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
    throw fail("Value " + value + " is no MST Node");
  }
  return value.$treenode;
}
function getStateTreeNodeSafe(value) {
  return value && value.$treenode || null;
}
function toJSON() {
  return getStateTreeNode(this).snapshot;
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
      throw fail("Could not resolve '" + part + "' in path '" + (joinJsonPath(pathParts.slice(0, i)) || "/") + "' while resolving '" + joinJsonPath(pathParts) + "'");
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
var plainObjectString = Object.toString();
var EMPTY_ARRAY = Object.freeze([]);
var EMPTY_OBJECT = Object.freeze({});
var mobxShallow = getGlobalState().useProxies ? { deep: false } : { deep: false, proxy: false };
Object.freeze(mobxShallow);
function fail(message) {
  if (message === void 0) {
    message = "Illegal state";
  }
  return new Error("[mobx-state-tree] " + message);
}
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
  return value === null || value === void 0 || typeof value === "string" || typeof value === "number" || typeof value === "boolean" || includeDate && value instanceof Date;
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
          return f.apply(void 0, __spread(args));
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
          (_a2 = handler).emit.apply(_a2, __spread(args));
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
  console.warn(new Error("[mobx-state-tree] " + msg));
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
      throw fail("expected " + typeName + " as argument " + asArray(argNumber).join(" or ") + ", got " + value + " instead");
    }
  }
}
function assertIsFunction(value, argNumber) {
  assertArg(value, function(fn) {
    return typeof fn === "function";
  }, "function", argNumber);
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
function splitPatch(patch) {
  if (!("oldValue" in patch))
    throw fail("Patches without `oldValue` field cannot be inversed");
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
    throw fail("a json path must be either rooted, empty or relative, but got '" + path + "'");
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
        return "snapshotProcessor(" + this._subtype.describe() + ")";
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
        var value = isType(thing) ? this._subtype : isStateTreeNode(thing) ? getSnapshot(thing, false) : this.preProcessSnapshotSafe(thing);
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
      throw fail("postSnapshotProcessor must be a function");
    }
    if (processors.preProcessor && typeof processors.preProcessor !== "function") {
      throw fail("preSnapshotProcessor must be a function");
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
          throw fail("Map.put cannot be used to set empty values");
        if (isStateTreeNode(value)) {
          var node = getStateTreeNode(value);
          if (devMode()) {
            if (!node.identifierAttribute) {
              throw fail(needsIdentifierError);
            }
          }
          if (node.identifier === null) {
            throw fail(needsIdentifierError);
          }
          this.set(node.identifier, value);
          return value;
        } else if (!isMutable(value)) {
          throw fail("Map.put can only be used to store complex values");
        } else {
          var mapNode = getStateTreeNode(this);
          var mapType = mapNode.type;
          if (mapType.identifierMode !== MapIdentifierMode.YES) {
            throw fail(needsIdentifierError);
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
              throw fail("The objects in a map should all have the same identifier attribute, expected '" + current + "', but child of type '" + type.name + "' declared attribute '" + type.identifierAttribute + "' as identifier");
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
          throw fail("Not a child " + key);
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
            throw fail("A map of objects containing an identifier should always store the object under their own identifier. Trying to store key '" + identifier2 + "', but expected: '" + expected + "'");
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
        typecheckInternal(this, snapshot);
        var target = node.storedValue;
        var currentKeys = {};
        Array.from(target.keys()).forEach(function(key2) {
          currentKeys[key2] = false;
        });
        if (snapshot) {
          for (var key in snapshot) {
            target.set(key, snapshot[key]);
            currentKeys["" + key] = true;
          }
        }
        Object.keys(currentKeys).forEach(function(key2) {
          if (currentKeys[key2] === false)
            target.delete(key2);
        });
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
  return new MapType("Map<string, " + subtype.name + ">", subtype);
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
        throw fail("Not a child: " + key);
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
                value: node.getChildNode("" + (change.index + i)).snapshot,
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
        typecheckInternal(this, snapshot);
        var target = node.storedValue;
        target.replace(snapshot);
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
  return new ArrayType(subtype.name + "[]", subtype);
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
        throw fail("Cannot add an object to a state tree if it is already part of the same or another state tree. Tried to assign an object to '" + parent.path + "/" + newPath + "', but it lives already at '" + getStateTreeNode(newValue).path + "'");
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
      throw fail(key + " is declared twice in the model. Model should not contain the same keys");
    }
    alreadySeenKeys.add(key);
  });
  return keysList.reduce(function(props, key) {
    if (key in Hook) {
      throw fail("Hook '" + key + "' was defined as property. Hooks should be defined as part of the actions");
    }
    var descriptor = Object.getOwnPropertyDescriptor(declaredProps, key);
    if ("get" in descriptor) {
      throw fail("Getters are not supported as properties. Please use views instead");
    }
    var value = descriptor.value;
    if (value === null || value === void 0) {
      throw fail("The default value of an attribute cannot be null or undefined as the type cannot be inferred. Did you mean `types.maybe(someType)`?");
    } else if (isPrimitive(value)) {
      props[key] = optional(getPrimitiveFactoryFromValue(value), value);
    } else if (value instanceof MapType) {
      props[key] = optional(value, {});
    } else if (value instanceof ArrayType) {
      props[key] = optional(value, []);
    } else if (isType(value)) ;
    else if (devMode() && typeof value === "function") {
      throw fail("Invalid type definition for property '" + key + "', it looks like you passed a function. Did you forget to invoke it, or did you intend to declare a view / action?");
    } else if (devMode() && typeof value === "object") {
      throw fail("Invalid type definition for property '" + key + "', it looks like you passed an object. Try passing another model type or a types.frozen.");
    } else {
      throw fail("Invalid type definition for property '" + key + "', cannot infer a type from a value like '" + value + "' (" + typeof value + ")");
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
              throw fail("Cannot define property '" + propName + "' as object identifier, property '" + identifierAttribute + "' is already defined as identifier property");
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
        if (!isPlainObject(actions))
          throw fail("actions initializer should return a plain object containing actions");
        Object.keys(actions).forEach(function(name) {
          if (name === PRE_PROCESS_SNAPSHOT)
            throw fail("Cannot define action '" + PRE_PROCESS_SNAPSHOT + "', it should be defined using 'type.preProcessSnapshot(fn)' instead");
          if (name === POST_PROCESS_SNAPSHOT)
            throw fail("Cannot define action '" + POST_PROCESS_SNAPSHOT + "', it should be defined using 'type.postProcessSnapshot(fn)' instead");
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
          throw fail("You passed an " + typeof fn + " to volatile state as an argument, when function is expected");
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
        if (!isPlainObject(state))
          throw fail("volatile state initializer should return a plain object containing state");
        set(self, state);
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
            throw fail("The `extend` function should return an object with a subset of the fields 'actions', 'views' and 'state'. Found invalid key '" + key + "'");
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
        if (!isPlainObject(views))
          throw fail("views initializer should return a plain object containing views");
        Object.getOwnPropertyNames(views).forEach(function(key) {
          var _a2;
          var descriptor = Object.getOwnPropertyDescriptor(views, key);
          if ("get" in descriptor) {
            apiDefineProperty(self, key, descriptor);
            makeObservable(self, (_a2 = {}, _a2[key] = computed, _a2));
          } else if (typeof descriptor.value === "function") {
            (!devMode() ? addHiddenFinalProp : addHiddenWritableProp)(self, key, descriptor.value);
          } else {
            throw fail("A view member should either be a function or getter based property");
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
          throw fail("Not a value property: " + key);
        var adm = getAdministration(node.storedValue, key);
        var childNode = (_a2 = adm.raw) === null || _a2 === void 0 ? void 0 : _a2.call(adm);
        if (!childNode)
          throw fail("Node not available for property " + key);
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
          try {
            var atom = getAtom(node.storedValue, name);
            atom.reportObserved();
          } catch (e) {
            throw fail(name + " property is declared twice");
          }
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
          throw fail("object does not support operation " + patch.op);
        }
        node.storedValue[subpath] = patch.value;
      }
    });
    Object.defineProperty(ModelType2.prototype, "applySnapshot", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(node, snapshot) {
        typecheckInternal(this, snapshot);
        var preProcessedSnapshot = this.applySnapshotPreProcessor(snapshot);
        this.forAllProps(function(name) {
          node.storedValue[name] = preProcessedSnapshot[name];
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
    throw fail("Model creation failed. First argument must be a string when two arguments are provided");
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
        return typeCheckFailure(context, value, "Value is not a " + typeName);
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
    case "object":
      if (value instanceof Date)
        return DatePrimitive;
  }
  throw fail("Cannot determine primitive type from value " + value);
}
function isPrimitiveType(type) {
  return isType(type) && (type.flags & (TypeFlags.String | TypeFlags.Number | TypeFlags.Integer | TypeFlags.Boolean | TypeFlags.Date)) > 0;
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
        return typeCheckFailure(context, value, "Value is not a literal " + JSON.stringify(this.value));
      }
    });
    return Literal2;
  })(SimpleType)
);
function literal(value) {
  assertArg(value, isPrimitive, "primitive", 1);
  return new Literal(value);
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
function enumeration(name, options) {
  var realOptions = typeof name === "string" ? options : name;
  if (devMode()) {
    realOptions.forEach(function(option, i) {
      assertIsString(option, i + 1);
    });
  }
  var type = union.apply(void 0, __spread(realOptions.map(function(option) {
    return literal("" + option);
  })));
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
          throw fail("No matching type for union " + this.describe());
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
          throw fail("No matching type for union " + this.describe());
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
  var types2 = isType(optionsOrType) ? __spread([optionsOrType], otherTypes) : otherTypes;
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
  return (type.flags & TypeFlags.Union) > 0;
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
    throw fail("default value cannot be an instance, pass a snapshot or a function that creates an instance/snapshot instead");
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
            throw fail("Late type seems to be used too early, the definition (still) returns undefined");
          if (t) {
            if (devMode() && !isType(t))
              throw fail("Failed to determine subtype, make sure types.late returns a type definition.");
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
  var name = typeof nameOrType === "string" ? nameOrType : "late(" + nameOrType.toString() + ")";
  var type = typeof nameOrType === "string" ? maybeType : nameOrType;
  if (devMode()) {
    if (!(typeof type === "function" && type.length === 0))
      throw fail("Invalid late type, expected a function with zero arguments that returns a type, got: " + type);
  }
  return new Late(name, type);
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
                path: "/" + node.subpath,
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
        return "<lazy " + this.name + ">";
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
      var _this = _super.call(this, subType ? "frozen(" + subType.name + ")" : "frozen") || this;
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
          throw fail("Can only store references with a defined identifier attribute.");
        var id = targetNode.unnormalizedIdentifier;
        if (id === null || id === void 0) {
          throw fail("Can only store references to tree nodes with a defined identifier.");
        }
        this.identifier = id;
      } else {
        throw fail("Can only store references to tree nodes or identifiers, got: '" + value + "'");
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
            throw new InvalidReferenceError("[mobx-state-tree] Failed to resolve reference '" + this.identifier + "' to type '" + this.targetType.name + "' (from node: " + node.path + ")");
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
      var _this = _super.call(this, "reference(" + targetType.name + ")") || this;
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
        return isValidIdentifier(value) ? typeCheckSuccess() : typeCheckFailure(context, value, "Value is not a valid identifier, which is a string or a number");
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
              if (!sync) {
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
      throw fail("References with base path are no longer supported. Please remove the base path.");
    }
  }
  var getSetOptions = options ? options : void 0;
  var onInvalidated = options ? options.onInvalidated : void 0;
  if (getSetOptions && (getSetOptions.get || getSetOptions.set)) {
    if (devMode()) {
      if (!getSetOptions.get || !getSetOptions.set) {
        throw fail("reference options must either contain both a 'get' and a 'set' method or none of them");
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
          throw fail("Identifier types can only be instantiated as direct child of a model type");
        return createScalarNode(this, parent, subpath, environment, initialValue);
      }
    });
    Object.defineProperty(BaseIdentifierType2.prototype, "reconcile", {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(current, newValue, parent, subpath) {
        if (current.storedValue !== newValue)
          throw fail("Tried to change identifier from '" + current.storedValue + "' to '" + newValue + "'. Changing identifiers is not allowed.");
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
          return typeCheckFailure(context, value, "Value is not a valid " + this.describe() + ", expected a " + this.validType);
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
function normalizeIdentifier(id) {
  return "" + id;
}
function isValidIdentifier(id) {
  return typeof id === "string" || typeof id === "number";
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
          return typeCheckFailure(context, value, "Invalid value for type '" + this.name + "': " + typeError);
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
  Date: DatePrimitive,
  map,
  array,
  frozen,
  identifier,
  identifierNumber,
  late,
  lazy,
  undefined: undefinedType,
  null: nullType,
  snapshotProcessor
};

// ../node_modules/@blazeo.com/calendar-client/dist/index.mjs
var ConfigModel = types.model("Config", {
  baseUrl: types.optional(types.string, ""),
  consumer: types.optional(types.string, "")
}).volatile(() => ({
  fetch: void 0,
  getDefaultOffset: () => -(/* @__PURE__ */ new Date()).getTimezoneOffset()
})).actions((self) => ({
  setBaseUrl(url) {
    self.baseUrl = url;
  },
  setConsumer(value) {
    self.consumer = value ?? "";
  },
  setFetch(fn) {
    self.fetch = fn;
  },
  setGetDefaultOffset(fn) {
    self.getDefaultOffset = fn;
  },
  configure(env) {
    if (env.baseUrl != null) self.baseUrl = env.baseUrl;
    if (env.consumer != null) self.consumer = env.consumer;
    if (env.fetch != null) self.fetch = env.fetch;
    if (env.getDefaultOffset != null) self.getDefaultOffset = env.getDefaultOffset;
  }
})).views((self) => ({
  getEnv() {
    return {
      baseUrl: self.baseUrl || void 0,
      consumer: self.consumer || void 0,
      fetch: self.fetch,
      getDefaultOffset: self.getDefaultOffset
    };
  }
}));
var _instance = null;
function getConfigStore() {
  if (!_instance) _instance = ConfigModel.create({});
  return _instance;
}
var ConfigModel_default = ConfigModel;
function configure(env) {
  const store = getConfigStore();
  store.configure(env);
}
function getConfig() {
  const store = getConfigStore();
  if (!store.baseUrl) return null;
  return store.getEnv();
}
function setBaseUrl(baseUrl) {
  getConfigStore().setBaseUrl(baseUrl);
}
function buildQuery(params) {
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params || {})) {
    if (v === void 0 || v === null) continue;
    if (Array.isArray(v)) {
      for (const item of v) search.append(k, String(item));
    } else {
      search.set(k, String(v));
    }
  }
  const q = search.toString();
  return q ? `?${q}` : "";
}
async function request(baseUrl, fetchFn, path, options = {}) {
  const { method = "GET", headers = {}, body, query, skipContentType } = options;
  const url = `${String(baseUrl).replace(/\/+$/, "")}${path}${buildQuery(query)}`;
  const reqHeaders = { ...headers };
  if (!skipContentType && typeof body === "string") reqHeaders["Content-Type"] = "application/json";
  const res = await fetchFn(url, { method, headers: reqHeaders, body });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { status: "failure", message: text || res.statusText };
  }
  if (!res.ok && data.status !== "failure") {
    data.status = "failure";
    data.message = data.message ?? `HTTP ${res.status}`;
  }
  return data;
}
function mergeConsumerHeader(env, opts) {
  const headers = { ...opts.headers || {} };
  if (!headers["Consumer"] && (env == null ? void 0 : env.consumer)) headers["Consumer"] = env.consumer;
  return { ...opts, headers };
}
function createRequestHelpers(self, getEnv9) {
  const env = () => getEnv9(self);
  const baseUrl = () => env().baseUrl;
  const fetchFn = () => env().fetch ?? (typeof fetch !== "undefined" ? fetch : () => {
    throw new Error("fetch not available");
  });
  const req = (path, opts = {}) => {
    const url = baseUrl();
    if (!url) throw new Error("Model env requires baseUrl. Call configure({ baseUrl }) at app startup.");
    return request(url, fetchFn(), path, mergeConsumerHeader(env(), opts));
  };
  return {
    req,
    reqGet: (path, query, opts = {}) => req(path, { ...opts, query }),
    reqPost: (path, body, query, opts = {}) => req(path, { ...opts, method: "POST", body: JSON.stringify(body), query })
  };
}
function createRequestHelpersFromEnv(env) {
  const e = env ?? getConfig();
  if (!e) throw new Error("Env required. Pass env to the method or call configure({ baseUrl }) at app startup.");
  const baseUrl = () => e == null ? void 0 : e.baseUrl;
  const fetchFn = () => (e == null ? void 0 : e.fetch) ?? (typeof fetch !== "undefined" ? fetch : () => {
    throw new Error("fetch not available");
  });
  const req = (path, opts = {}) => {
    const url = baseUrl();
    if (!url) throw new Error("Env requires baseUrl. Call configure({ baseUrl }) at app startup.");
    return request(url, fetchFn(), path, mergeConsumerHeader(e, opts));
  };
  return {
    env: e,
    req,
    reqGet: (path, query, opts = {}) => req(path, { ...opts, query }),
    reqPost: (path, body, query, opts = {}) => req(path, { ...opts, method: "POST", body: JSON.stringify(body), query })
  };
}
var Unit = {
  Minutes: 1,
  Hours: 2,
  Days: 3,
  Months: 4,
  Year: 5,
  Week: 6
};
var AssignmentMethod = {
  RoundRobin: 1,
  MaximizeAvailability: 2
};
var AttendeeStatus = {
  None: 0,
  Accepted: 1,
  Declined: 2,
  Tentative: 3,
  NeedsAction: 4,
  Canceled: 5
};
var RecurringFrequency = {
  None: 0,
  Daily: 1,
  Weekly: 2,
  Monthly: 3,
  Yearly: 4
};
var DayOfWeek = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6
};
var TimeSlotModel = types.model("TimeSlot", {
  startHour: types.optional(types.number, 0),
  startMinute: types.optional(types.number, 0),
  endHour: types.optional(types.number, 0),
  endMinute: types.optional(types.number, 0),
  startDate: types.string,
  endDate: types.string,
  participantId: types.maybeNull(types.string)
}).actions((self) => ({
  setWithOffset(offsetMinutes) {
    const start = new Date(self.startDate);
    const end = new Date(self.endDate);
    start.setMinutes(start.getMinutes() + offsetMinutes);
    end.setMinutes(end.getMinutes() + offsetMinutes);
    self.startDate = start.toISOString();
    self.endDate = end.toISOString();
    self.startHour = start.getHours();
    self.startMinute = start.getMinutes();
    self.endHour = end.getHours();
    self.endMinute = end.getMinutes();
  }
}));
var TimeSlot_default = TimeSlotModel;
var TimeFrameModel = types.model("TimeFrame", {
  start: types.string,
  end: types.string
}).actions((self) => ({
  buffer(bufferMinutes, unit) {
    const bfr = unit === Unit.Hours ? bufferMinutes * 60 : bufferMinutes;
    const s = new Date(self.start);
    const e = new Date(self.end);
    s.setMinutes(s.getMinutes() - bfr);
    e.setMinutes(e.getMinutes() + bfr);
    self.start = s.toISOString();
    self.end = e.toISOString();
  },
  conflicts(start, end) {
    const thisStart = new Date(self.start).getTime();
    const thisEnd = new Date(self.end).getTime();
    const startT = start.getTime();
    const endT = end.getTime();
    return startT >= thisStart && startT <= thisEnd || endT >= thisStart && endT <= thisEnd || startT <= thisStart && endT >= thisEnd;
  },
  breakIntoSlots(slotDurationMinutes) {
    const start = new Date(self.start);
    const end = new Date(self.end);
    const slots = [];
    let current = new Date(start);
    const align = (m) => {
      if (m === 0 || m === 15 || m === 30 || m === 45) return m;
      if (m > 0 && m < 15) return 15;
      if (m > 15 && m < 30) return 30;
      if (m > 30 && m < 45) return 45;
      return 0;
    };
    current.setMinutes(align(current.getMinutes()), 0, 0);
    let slotEnd = new Date(current.getTime());
    slotEnd.setMinutes(slotEnd.getMinutes() + slotDurationMinutes);
    while (slotEnd.getTime() <= end.getTime()) {
      slots.push({
        startHour: current.getHours(),
        startMinute: current.getMinutes(),
        endHour: slotEnd.getHours(),
        endMinute: slotEnd.getMinutes(),
        startDate: current.toISOString(),
        endDate: slotEnd.toISOString()
      });
      current = new Date(slotEnd.getTime());
      slotEnd.setMinutes(slotEnd.getMinutes() + slotDurationMinutes);
    }
    return slots;
  }
}));
var TimeFrame_default = TimeFrameModel;
function getDefaultOffset() {
  var _a2;
  const cfg = getConfig();
  return ((_a2 = cfg == null ? void 0 : cfg.getDefaultOffset) == null ? void 0 : _a2.call(cfg)) ?? -(/* @__PURE__ */ new Date()).getTimezoneOffset();
}
var EventModel = types.model("Event", {
  id: types.optional(types.maybeNull(types.number), null),
  eventId: types.identifier,
  calendarId: types.optional(types.string, ""),
  participantId: types.optional(types.maybeNull(types.string), null),
  title: types.optional(types.maybeNull(types.string), null),
  description: types.optional(types.maybeNull(types.string), null),
  isRecurring: types.optional(types.boolean, false),
  recurringFrequency: types.optional(types.number, RecurringFrequency.None),
  startDate: types.optional(types.string, ""),
  endDate: types.optional(types.string, ""),
  startHour: types.optional(types.number, 0),
  startMinute: types.optional(types.number, 0),
  endHour: types.optional(types.number, 0),
  endMinute: types.optional(types.number, 0),
  visitorName: types.optional(types.maybeNull(types.string), null),
  visitorEmail: types.optional(types.maybeNull(types.string), null),
  visitorPhone: types.optional(types.maybeNull(types.string), null),
  createdOn: types.optional(types.maybeNull(types.string), null),
  modifiedOn: types.optional(types.maybeNull(types.string), null),
  externalEventId: types.optional(types.maybeNull(types.string), null),
  attendeeStatus: types.optional(types.number, AttendeeStatus.Tentative),
  rescheduleLink: types.optional(types.maybeNull(types.string), null),
  cancelLink: types.optional(types.maybeNull(types.string), null),
  timeZone: types.optional(types.maybeNull(types.string), null),
  offset: types.optional(types.number, 0)
}).actions((self) => {
  const { req, reqGet, reqPost } = createRequestHelpers(self, getEnv);
  const getOffset = () => {
    var _a2, _b;
    return ((_b = (_a2 = getEnv(self)).getDefaultOffset) == null ? void 0 : _b.call(_a2)) ?? getDefaultOffset();
  };
  return {
    /** GET /event/get – fetch this event by eventId or externalEventId */
    async get(params) {
      if ((params == null ? void 0 : params.eventId) ?? (params == null ? void 0 : params.event_id)) {
        const res = await reqGet("/event/get", { event_id: params.eventId ?? params.event_id });
        if (res.status === "success" && res.data) applySnapshot(self, { ...res.data, eventId: self.eventId });
        return res;
      }
      if ((params == null ? void 0 : params.externalEventId) ?? (params == null ? void 0 : params.externalevent_id)) {
        const res = await reqGet("/event/get", { externalevent_id: params.externalEventId ?? params.externalevent_id });
        if (res.status === "success" && res.data) applySnapshot(self, { ...res.data, eventId: self.eventId });
        return res;
      }
      return { status: "failure", message: "Provide eventId or externalEventId" };
    },
    /** POST /event/create – create event */
    async create(offsetMinutes) {
      const offset = offsetMinutes ?? getOffset();
      const payload = {
        calendarId: self.calendarId,
        participantId: self.participantId ?? void 0,
        title: self.title ?? void 0,
        description: self.description ?? void 0,
        startDate: self.startDate,
        endDate: self.endDate,
        startHour: self.startHour,
        startMinute: self.startMinute,
        endHour: self.endHour,
        endMinute: self.endMinute,
        visitorName: self.visitorName ?? void 0,
        visitorEmail: self.visitorEmail ?? void 0,
        visitorPhone: self.visitorPhone ?? void 0
      };
      const res = await reqPost("/event/create", payload, null, { headers: { offset: String(offset) } });
      if (res.status === "success" && res.data) applySnapshot(self, { ...res.data, eventId: self.eventId });
      return res;
    },
    /** POST /event/update – update event */
    async update() {
      const payload = {
        eventId: self.eventId,
        calendarId: self.calendarId,
        participantId: self.participantId ?? void 0,
        title: self.title ?? void 0,
        description: self.description ?? void 0,
        startDate: self.startDate,
        endDate: self.endDate,
        startHour: self.startHour,
        startMinute: self.startMinute,
        endHour: self.endHour,
        endMinute: self.endMinute,
        visitorName: self.visitorName ?? void 0,
        visitorEmail: self.visitorEmail ?? void 0,
        visitorPhone: self.visitorPhone ?? void 0
      };
      return reqPost("/event/update", payload);
    },
    /** POST /event/reschedule – reschedule event */
    async reschedule(offsetMinutes) {
      const offset = offsetMinutes ?? getOffset();
      const payload = {
        eventId: self.eventId,
        calendarId: self.calendarId,
        participantId: self.participantId ?? void 0,
        title: self.title ?? void 0,
        description: self.description ?? void 0,
        startDate: self.startDate,
        endDate: self.endDate,
        startHour: self.startHour,
        startMinute: self.startMinute,
        endHour: self.endHour,
        endMinute: self.endMinute,
        visitorName: self.visitorName ?? void 0,
        visitorEmail: self.visitorEmail ?? void 0,
        visitorPhone: self.visitorPhone ?? void 0
      };
      const res = await reqPost("/event/reschedule", payload, null, { headers: { offset: String(offset) } });
      if (res.status === "success" && res.data) applySnapshot(self, { ...res.data, eventId: self.eventId });
      return res;
    },
    /** GET /event/cancel – cancel this event */
    async cancel() {
      return reqGet("/event/cancel", { event_id: self.eventId });
    },
    /** GET /event/cancellable – check if this event is cancellable */
    async getCancellable() {
      const res = await reqGet("/event/cancellable", { event_id: self.eventId });
      if (res.data !== void 0) return { ...res, data: Boolean(res.data) };
      return res;
    },
    /** GET /event/availability/get – get availability slots for a day */
    async getAvailability(params) {
      const query = {
        calendar_id: self.calendarId,
        year: params.year,
        month: params.month,
        day: params.day
      };
      if (params.participantId ?? self.participantId) query.participant_id = params.participantId ?? self.participantId;
      return reqGet("/event/availability/get", query, { headers: { offset: String(params.offset ?? getOffset()) } });
    },
    /** GET /event/seteventreminder/{event_id} – set SMS reminder */
    async setReminder() {
      return req(`/event/seteventreminder/${encodeURIComponent(self.eventId)}`, { method: "GET" });
    },
    /** GET /event/{eventId}/{attendeeStatus} – set attendee status */
    async setAttendeeStatus(status) {
      const statusName = typeof status === "number" ? Object.keys(AttendeeStatus).find((k) => AttendeeStatus[k] === status) ?? "None" : status;
      return reqGet(`/event/${encodeURIComponent(self.eventId)}/${encodeURIComponent(statusName)}`);
    }
  };
});
function mapEventFromApi(d) {
  if (!d) return d;
  const pick = (...keys) => keys.reduce((v, k) => v ?? d[k], void 0);
  const n = (v) => v != null && v !== "" ? Number(v) : void 0;
  return {
    eventId: String(pick("eventId", "EventId", "event_id") ?? ""),
    calendarId: String(pick("calendarId", "CalendarId", "calendar_id") ?? ""),
    participantId: pick("participantId", "ParticipantId", "participant_id") ?? null,
    title: pick("title", "Title"),
    description: pick("description", "Description"),
    startDate: pick("startDate", "StartDate", "start_date"),
    endDate: pick("endDate", "EndDate", "end_date"),
    startHour: n(pick("startHour", "StartHour", "start_hour")),
    startMinute: n(pick("startMinute", "StartMinute", "start_minute")),
    endHour: n(pick("endHour", "EndHour", "end_hour")),
    endMinute: n(pick("endMinute", "EndMinute", "end_minute")),
    visitorName: pick("visitorName", "VisitorName", "visitor_name"),
    visitorEmail: pick("visitorEmail", "VisitorEmail", "visitor_email"),
    visitorPhone: pick("visitorPhone", "VisitorPhone", "visitor_phone"),
    externalEventId: pick("externalEventId", "ExternalEventId", "external_event_id"),
    attendeeStatus: n(pick("attendeeStatus", "AttendeeStatus", "attendee_status")),
    rescheduleLink: pick("rescheduleLink", "RescheduleLink", "reschedule_link"),
    cancelLink: pick("cancelLink", "CancelLink", "cancel_link"),
    timeZone: pick("timeZone", "TimeZone", "time_zone"),
    createdOn: pick("createdOn", "CreatedOn", "created_on"),
    modifiedOn: pick("modifiedOn", "ModifiedOn", "modified_on")
  };
}
EventModel.get = async (eventId) => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const res = await reqGet("/event/get", { event_id: eventId });
  if (res.status === "success" && res.data) {
    return EventModel.create(mapEventFromApi(res.data), { env: getConfig() });
  }
  return null;
};
EventModel.getByExternalId = async (externalEventId) => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const res = await reqGet("/event/get", { externalevent_id: externalEventId });
  if (res.status === "success" && res.data) {
    return EventModel.create(mapEventFromApi(res.data), { env: getConfig() });
  }
  return null;
};
EventModel.getRoundRobinParticipant = async (calendarId) => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const res = await reqGet("/event/participant/roundrobin/get", { calendar_id: calendarId });
  return res.status === "success" ? res.data : null;
};
EventModel.getEarliestAvailableDays = async (calendarId, count, opts = {}) => {
  const { req } = createRequestHelpersFromEnv(getConfig());
  const query = { calendar_id: calendarId, count };
  if (opts.year != null) query.year = opts.year;
  if (opts.month != null) query.month = opts.month;
  if (opts.day != null) query.day = opts.day;
  const offset = opts.offset ?? getDefaultOffset();
  const res = await req("/event/days/available/get", { method: "GET", query, headers: { offset: String(offset) } });
  return res.status === "success" && Array.isArray(res.data) ? res.data : null;
};
EventModel.getDaySelectable = async (calendarId, year, month, day, opts = {}) => {
  const { req } = createRequestHelpersFromEnv(getConfig());
  const query = { calendar_id: calendarId, year, month, day };
  if (opts.participantId) query.participant_id = opts.participantId;
  const offset = opts.offset ?? getDefaultOffset();
  const res = await req("/event/day/selectable/get", { method: "GET", query, headers: { offset: String(offset) } });
  return res.status === "success" ? Boolean(res.data) : false;
};
EventModel.getByVisitorEmail = async (email, opts = {}) => {
  const { req } = createRequestHelpersFromEnv(getConfig());
  const query = { email };
  if (opts.companyKey) query.company_key = opts.companyKey;
  else if (opts.calendarId) query.calendar_id = opts.calendarId;
  else throw new Error("companyKey or calendarId required");
  const offset = opts.offset ?? getDefaultOffset();
  const res = await req("/event/existing/getbyvisitoremail", { method: "GET", query, headers: { offset: String(offset) } });
  if (res.status === "success" && Array.isArray(res.data)) {
    return res.data.map((e) => EventModel.create(mapEventFromApi(e), { env: getConfig() }));
  }
  return null;
};
EventModel.getByVisitorPhone = async (phone, opts = {}) => {
  const { req } = createRequestHelpersFromEnv(getConfig());
  const query = { phone };
  if (opts.companyKey) query.company_key = opts.companyKey;
  else if (opts.calendarId) query.calendar_id = opts.calendarId;
  else throw new Error("companyKey or calendarId required");
  const offset = opts.offset ?? getDefaultOffset();
  const res = await req("/event/existing/getbyvisitorphone", { method: "GET", query, headers: { offset: String(offset) } });
  if (res.status === "success" && Array.isArray(res.data)) {
    return res.data.map((e) => EventModel.create(mapEventFromApi(e), { env: getConfig() }));
  }
  return null;
};
async function getByFiltersInternal(path, companyKey, opts = {}, dateRange = null) {
  if (companyKey == null || String(companyKey).trim() === "") {
    throw new Error("companyKey required");
  }
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const query = {
    company_key: String(companyKey).trim()
  };
  if (dateRange) {
    if (dateRange.startDateFrom == null || dateRange.startDateTo == null) {
      throw new Error("startDateFrom and startDateTo required");
    }
    query.start_date_from = dateRange.startDateFrom;
    query.start_date_to = dateRange.startDateTo;
  }
  const offset = opts.offset ?? getDefaultOffset();
  if (opts.calendarId != null && opts.calendarId !== "") query.calendar_id = opts.calendarId;
  if (opts.participantId != null && opts.participantId !== "") query.participant_id = opts.participantId;
  if (opts.leadId != null && opts.leadId !== "") query.lead_id = opts.leadId;
  if (opts.visitorName != null && opts.visitorName !== "") query.visitor_name = opts.visitorName;
  if (opts.visitorEmail != null && opts.visitorEmail !== "") query.visitor_email = opts.visitorEmail;
  if (opts.visitorPhone != null && opts.visitorPhone !== "") query.visitor_phone = opts.visitorPhone;
  if (opts.title != null && opts.title !== "") query.title = opts.title;
  if (opts.search != null && opts.search !== "") query.search = opts.search;
  if (opts.attendeeStatus != null && opts.attendeeStatus !== "") query.attendee_status = opts.attendeeStatus;
  if (opts.eventSource != null && opts.eventSource !== "") query.event_source = opts.eventSource;
  const sortBy = opts.sortBy ?? opts.sort ?? opts.sort_column;
  if (sortBy != null && sortBy !== "") query.sort = sortBy;
  const sortOrderRaw = opts.sortOrder ?? opts.sort_dir;
  if (sortOrderRaw != null && String(sortOrderRaw).trim() !== "") {
    const u = String(sortOrderRaw).trim().toUpperCase();
    query.sort_dir = u.startsWith("DESC") ? "desc" : "asc";
  }
  if (opts.page != null) {
    query.page = opts.page;
    if (opts.page_size != null) query.page_size = opts.page_size;
  } else {
    if (opts.skip != null) query.skip = opts.skip;
    if (opts.take != null) query.take = opts.take;
  }
  const res = await reqGet(path, query, { headers: { offset: String(offset) } });
  if (res.status !== "success") {
    return { events: [], totalCount: 0 };
  }
  const payload = res.data ?? {};
  const eventsRaw = Array.isArray(payload) ? payload : Array.isArray(payload.Events) ? payload.Events : Array.isArray(payload.events) ? payload.events : [];
  const totalCountRaw = payload.TotalCount ?? payload.totalCount;
  const totalCount = Number.isFinite(Number(totalCountRaw)) ? Number(totalCountRaw) : eventsRaw.length;
  const events = eventsRaw.map((e) => EventModel.create(mapEventFromApi(e), { env: getConfig() }));
  return { events, totalCount };
}
EventModel.getByDateRangeWithFilters = async (companyKey, startDateFrom, startDateTo, opts = {}) => getByFiltersInternal("/event/search/daterange/get", companyKey, opts, { startDateFrom, startDateTo });
EventModel.getByFilters = async (companyKey, opts = {}) => getByFiltersInternal("/event/search/get", companyKey, opts);
EventModel.getAvailability = async (calendarId, year, month, day, opts = {}) => {
  const { req } = createRequestHelpersFromEnv(getConfig());
  const query = { calendar_id: calendarId, year, month, day };
  if (opts.participantId) query.participant_id = opts.participantId;
  const offset = opts.offset ?? getDefaultOffset();
  const res = await req("/event/availability/get", { method: "GET", query, headers: { offset: String(offset) } });
  if (res.status === "success" && Array.isArray(res.data)) {
    return res.data.map((s) => TimeSlot_default.create({
      startHour: s.startHour ?? s.StartHour,
      startMinute: s.startMinute ?? s.StartMinute,
      endHour: s.endHour ?? s.EndHour,
      endMinute: s.endMinute ?? s.EndMinute,
      startDate: s.startDate ?? s.StartDate,
      endDate: s.endDate ?? s.EndDate,
      participantId: s.participantId ?? s.ParticipantId ?? null
    }));
  }
  return [];
};
EventModel.getExternalUnavailability = async (participantId, opts = {}) => {
  if (!participantId) throw new Error("participantId required");
  const { req } = createRequestHelpersFromEnv(getConfig());
  const query = { participant_id: participantId };
  if (opts.startUtc && opts.endUtc) {
    query.start_utc = opts.startUtc;
    query.end_utc = opts.endUtc;
  } else {
    if (opts.year == null || opts.month == null || opts.day == null) {
      throw new Error("Provide startUtc/endUtc or year/month/day");
    }
    query.year = opts.year;
    query.month = opts.month;
    query.day = opts.day;
    if (opts.days != null) query.days = opts.days;
  }
  const offset = opts.offset ?? getDefaultOffset();
  const res = await req("/externalcalendar/unavailability/get", { method: "GET", query, headers: { offset: String(offset) } });
  if (res.status === "success" && Array.isArray(res.data)) {
    return res.data.map((f) => TimeFrame_default.create({
      start: f.start ?? f.Start,
      end: f.end ?? f.End
    }));
  }
  return [];
};
EventModel.cancel = async (eventId) => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  return reqGet("/event/cancel", { event_id: eventId });
};
EventModel.getCancellable = async (eventId) => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const res = await reqGet("/event/cancellable", { event_id: eventId });
  return res.status === "success" ? Boolean(res.data) : false;
};
EventModel.createEvent = async (payload, offsetMinutes) => {
  const { reqPost } = createRequestHelpersFromEnv(getConfig());
  const offset = offsetMinutes ?? getDefaultOffset();
  const res = await reqPost("/event/create", payload, null, { headers: { offset: String(offset) } });
  if (res.status === "success" && res.data) {
    return EventModel.create(mapEventFromApi(res.data), { env: getConfig() });
  }
  return null;
};
EventModel.reschedule = async (payload, offsetMinutes) => {
  const { reqPost } = createRequestHelpersFromEnv(getConfig());
  const offset = offsetMinutes ?? getDefaultOffset();
  const res = await reqPost("/event/reschedule", payload, null, { headers: { offset: String(offset) } });
  if (res.status === "success" && res.data) {
    return EventModel.create(mapEventFromApi(res.data), { env: getConfig() });
  }
  return null;
};
EventModel.updateEvent = async (payload) => {
  const { reqPost } = createRequestHelpersFromEnv(getConfig());
  return reqPost("/event/update", payload);
};
EventModel.createTest = async (payload, offsetMinutes) => {
  const { reqPost } = createRequestHelpersFromEnv(getConfig());
  const offset = offsetMinutes ?? getDefaultOffset();
  return reqPost("/event/testcreate", payload, null, { headers: { offset: String(offset) } });
};
EventModel.getCustomData = async (calendarId, eventId) => {
  const { reqPost } = createRequestHelpersFromEnv(getConfig());
  const query = { calendar_id: calendarId };
  if (eventId) query.event_id = eventId;
  const res = await reqPost("/event/customdata/get", {}, query);
  if (res.status === "success" && typeof res.data === "string") {
    try {
      return JSON.parse(res.data);
    } catch {
      return res.data;
    }
  }
  return res.status === "success" ? res.data : null;
};
EventModel.setReminder = async (eventId) => {
  const { req } = createRequestHelpersFromEnv(getConfig());
  return req(`/event/seteventreminder/${encodeURIComponent(eventId)}`, { method: "GET" });
};
EventModel.setAttendeeStatus = async (eventId, attendeeStatus) => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const statusName = typeof attendeeStatus === "number" ? Object.keys(AttendeeStatus).find((k) => AttendeeStatus[k] === attendeeStatus) ?? "None" : attendeeStatus;
  return reqGet(`/event/${encodeURIComponent(eventId)}/${encodeURIComponent(statusName)}`);
};
var Event_default = EventModel;
var ParticipantInfoModel = types.model("ParticipantInfo", {
  participantId: types.optional(types.string, ""),
  calendarParticipantId: types.optional(types.string, ""),
  alias: types.maybeNull(types.string),
  email: types.maybeNull(types.string),
  isApproved: types.optional(types.boolean, false),
  emailProvider: types.optional(types.number, 0),
  isAvailable: types.optional(types.boolean, false)
});
var ParticipantInfo_default = ParticipantInfoModel;
var CalendarParticipantModel = types.model("CalendarParticipant", {
  id: types.optional(types.maybeNull(types.number), null),
  calendarParticipantId: types.optional(types.string, ""),
  participantId: types.optional(types.string, ""),
  calendarId: types.optional(types.string, ""),
  createdOn: types.optional(types.maybeNull(types.string), null),
  modifiedOn: types.optional(types.maybeNull(types.string), null)
});
function mapFromApi(d) {
  if (!d) return d;
  const pick = (...keys) => keys.reduce((v, k) => v ?? d[k], void 0);
  return {
    id: pick("id", "Id"),
    calendarParticipantId: String(pick("calendarParticipantId", "CalendarParticipantId", "calendarparticipant_id") ?? ""),
    participantId: String(pick("participantId", "ParticipantId", "participant_id") ?? ""),
    calendarId: String(pick("calendarId", "CalendarId", "calendar_id") ?? ""),
    createdOn: pick("createdOn", "CreatedOn", "created_on") ?? null,
    modifiedOn: pick("modifiedOn", "ModifiedOn", "modified_on") ?? null
  };
}
CalendarParticipantModel.getByCalendar = async (calendarId) => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const res = await reqGet("/Calendar/Participant/Get", { calendar_id: calendarId });
  if (res.status === "success" && res.data != null) {
    const arr = Array.isArray(res.data) ? res.data : typeof res.data === "string" ? JSON.parse(res.data) : [];
    return arr.map((p) => CalendarParticipantModel.create(mapFromApi({ ...p, calendar_id: calendarId })));
  }
  return null;
};
CalendarParticipantModel.getInfoByCalendar = async (calendarId) => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const res = await reqGet("/Calendar/Participants/GetInfo", { calendar_id: calendarId });
  if (res.status === "success" && Array.isArray(res.data)) {
    return res.data.map(
      (p) => ParticipantInfo_default.create({
        participantId: p.participantId ?? p.ParticipantId ?? p.participant_id ?? "",
        calendarParticipantId: p.calendarParticipantId ?? p.CalendarParticipantId ?? p.calendarparticipant_id ?? "",
        alias: p.alias ?? p.Alias ?? null,
        email: p.email ?? p.Email ?? null,
        isApproved: p.isApproved ?? p.IsApproved ?? p.is_approved ?? false,
        emailProvider: p.emailProvider ?? p.EmailProvider ?? p.email_provider ?? 0,
        isAvailable: p.isAvailable ?? p.IsAvailable ?? p.is_available ?? false
      })
    );
  }
  return null;
};
CalendarParticipantModel.getByParticipant = async (participantId) => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const res = await reqGet("/Participant/calendar/get", { participant_id: participantId });
  if (res.status === "success" && res.data != null) {
    const arr = Array.isArray(res.data) ? res.data : typeof res.data === "string" ? JSON.parse(res.data) : [];
    return arr.map((p) => CalendarParticipantModel.create(mapFromApi({ ...p, participant_id: participantId })));
  }
  return null;
};
var CalendarParticipant_default = CalendarParticipantModel;
var CalendarDayModel = types.model("CalendarDay", {
  date: types.optional(types.string, "")
});
var CalendarDay_default = CalendarDayModel;
var CalendarModel = types.model("Calendar", {
  id: types.maybeNull(types.number),
  companyKey: types.maybeNull(types.string),
  calendarId: types.optional(types.identifier, "new"),
  name: types.maybeNull(types.string),
  //    location: types.maybeNull(types.string),
  timeZoneId: types.maybeNull(types.string),
  purpose: types.optional(types.string, ""),
  description: types.maybeNull(types.string),
  assignmentMethod: types.optional(types.number, AssignmentMethod.RoundRobin),
  duration: types.optional(types.number, 0),
  durationUnit: types.optional(types.number, Unit.Minutes),
  minimumBookingNotice: types.optional(types.number, 0),
  minimumBookingNoticeUnit: types.optional(types.number, Unit.Minutes),
  minimumCancelationNotice: types.optional(types.number, 0),
  minimumCancelationNoticeUnit: types.optional(types.number, Unit.Minutes),
  futureLimit: types.optional(types.number, 0),
  futureLimitUnit: types.optional(types.number, Unit.Days),
  bufferTime: types.optional(types.number, 0),
  bufferTimeUnit: types.optional(types.number, Unit.Minutes),
  bookingLimit: types.optional(types.number, 0),
  createdOn: types.maybeNull(types.string),
  modifiedOn: types.maybeNull(types.string)
}).actions((self) => {
  const { req, reqGet, reqPost } = createRequestHelpers(self, getEnv);
  return {
    /** GET Calendar/Get – fetch this calendar by calendarId */
    async get() {
      if (!self.calendarId) return { status: "failure", message: "calendarId required" };
      const res = await reqGet("/Calendar/Get", { calendar_id: self.calendarId });
      if (res.status === "success" && res.data) {
        applySnapshot(self, { ...res.data, calendarId: self.calendarId });
      }
      return res;
    },
    /** POST Calendar/Create – create or update calendar */
    async create() {
      const payload = {
        calendarId: self.calendarId || void 0,
        companyKey: self.companyKey ?? void 0,
        name: self.name ?? void 0,
        timeZoneId: self.timeZoneId ?? void 0,
        purpose: self.purpose,
        description: self.description ?? void 0,
        assignmentMethod: self.assignmentMethod,
        duration: self.duration,
        durationUnit: self.durationUnit,
        minimumBookingNotice: self.minimumBookingNotice,
        minimumBookingNoticeUnit: self.minimumBookingNoticeUnit,
        minimumCancelationNotice: self.minimumCancelationNotice,
        minimumCancelationNoticeUnit: self.minimumCancelationNoticeUnit,
        futureLimit: self.futureLimit,
        futureLimitUnit: self.futureLimitUnit,
        bufferTime: self.bufferTime,
        bufferTimeUnit: self.bufferTimeUnit,
        bookingLimit: self.bookingLimit
      };
      const res = await reqPost("/Calendar/Create", payload);
      if (res.status === "success" && res.data) {
        self, { ...res.data, calendarId: res.data.calendarId || self.calendarId };
      }
      return res;
    },
    /** GET Calendar/Remove */
    async remove() {
      if (!self.calendarId) return { status: "failure", message: "calendarId required" };
      return reqGet("/Calendar/Remove", { calendar_id: self.calendarId });
    },
    /** POST Calendar/Event/Update */
    async update() {
      const payload = {
        calendarId: self.calendarId,
        companyKey: self.companyKey ?? void 0,
        name: self.name ?? void 0,
        timeZoneId: self.timeZoneId ?? void 0,
        purpose: self.purpose,
        description: self.description ?? void 0,
        assignmentMethod: self.assignmentMethod,
        duration: self.duration,
        durationUnit: self.durationUnit,
        minimumBookingNotice: self.minimumBookingNotice,
        minimumBookingNoticeUnit: self.minimumBookingNoticeUnit,
        minimumCancelationNotice: self.minimumCancelationNotice,
        minimumCancelationNoticeUnit: self.minimumCancelationNoticeUnit,
        futureLimit: self.futureLimit,
        futureLimitUnit: self.futureLimitUnit,
        bufferTime: self.bufferTime,
        bufferTimeUnit: self.bufferTimeUnit,
        bookingLimit: self.bookingLimit
      };
      return reqPost("/Calendar/Event/Update", payload);
    },
    /** GET Calendar/Participant/Add */
    async addParticipant(participantId) {
      if (!self.calendarId) return { status: "failure", message: "calendarId required" };
      return reqGet("/Calendar/Participant/Add", { calendar_id: self.calendarId, participant_id: participantId });
    },
    /** GET Calendar/Participant/Remove */
    async removeParticipant(participantId) {
      if (!self.calendarId) return { status: "failure", message: "calendarId required" };
      return reqGet("/Calendar/Participant/Remove", { calendar_id: self.calendarId, participant_id: participantId });
    },
    /** GET Calendar/Participant/OpeningHours/Get */
    async getParticipantOpeningHours(params = {}) {
      if (!self.calendarId && !params.calendarParticipantId) {
        return { status: "failure", message: "calendarId or calendarParticipantId required" };
      }
      const q = {};
      if (params.calendarParticipantId) q.calendarparticipant_id = params.calendarParticipantId;
      if (params.participantId) q.participant_id = params.participantId;
      if (params.calendarId) q.calendar_id = params.calendarId;
      else if (self.calendarId) q.calendar_id = self.calendarId;
      return reqGet("/Calendar/Participant/OpeningHours/Get", q);
    },
    /** POST Calendar/Participant/Availability/OpeningHour/Save */
    async saveOpeningHour(payload) {
      return reqPost("/Calendar/Participant/Availability/OpeningHour/Save", payload);
    },
    /** POST Calendar/Participant/Availability/OpeningHours/Save */
    async saveOpeningHours(payload) {
      return reqPost("/Calendar/Participant/Availability/OpeningHours/Save", payload);
    },
    /** GET Calendar/Participant/OpeningHour/Remove */
    async removeParticipantOpeningHours(participantId) {
      if (!self.calendarId) return { status: "failure", message: "calendarId required" };
      return reqGet("/Calendar/Participant/OpeningHour/Remove", { calendar_id: self.calendarId, participant_id: participantId });
    },
    /** GET Calendar/Participant/Availability/Add */
    async addParticipantAvailability(participantId, detail) {
      if (!self.calendarId) return { status: "failure", message: "calendarId required" };
      return req("/Calendar/Participant/Availability/Add", {
        method: "GET",
        query: { calendar_id: self.calendarId, participant_id: participantId },
        body: JSON.stringify(detail)
      });
    },
    /** GET Calendar/Participant/All */
    async getParticipants() {
      if (!self.calendarId) return { status: "failure", message: "calendarId required" };
      return reqGet("/Calendar/Participant/All", { calendar_id: self.calendarId });
    },
    /** GET Calendar/Month/Get */
    async getMonth(year, month) {
      if (!self.calendarId) return { status: "failure", message: "calendarId required" };
      return reqGet("/Calendar/Month/Get", { calendar_id: self.calendarId, year, month });
    },
    /** GET Calendar/Events/Get */
    async getEvents() {
      if (!self.calendarId) return { status: "failure", message: "calendarId required" };
      return reqGet("/Calendar/Events/Get", { calendar_id: self.calendarId });
    },
    /** GET Calendar/Participant/Get */
    async getCalendarParticipant() {
      if (!self.calendarId) return { status: "failure", message: "calendarId required" };
      return reqGet("/Calendar/Participant/Get", { calendar_id: self.calendarId });
    },
    /** GET Calendar/Participants/GetInfo */
    async getParticipantsInfo() {
      if (!self.calendarId) return { status: "failure", message: "calendarId required" };
      return reqGet("/Calendar/Participants/GetInfo", { calendar_id: self.calendarId });
    },
    /** GET Calendar/All – calendars by company_key with paging options */
    async getByCompany(companyKey, opts = {}) {
      const resolvedCompanyKey = companyKey || self.companyKey;
      const q = { company_key: resolvedCompanyKey };
      const sortBy = opts.sortBy ?? opts.sort ?? opts.sort_column;
      if (sortBy != null && sortBy !== "") q.sort = sortBy;
      const sortOrderRaw = opts.sortOrder ?? opts.sort_dir;
      if (sortOrderRaw != null && String(sortOrderRaw).trim() !== "") {
        const u = String(sortOrderRaw).trim().toUpperCase();
        q.sort_dir = u.startsWith("DESC") ? "desc" : "asc";
      }
      if (opts.page != null) {
        q.page = opts.page;
        if (opts.page_size != null) q.page_size = opts.page_size;
      } else {
        if (opts.skip != null) q.skip = opts.skip;
        if (opts.take != null) q.take = opts.take;
      }
      return reqGet("/Calendar/All", q);
    },
    /** GET Calendar/TimeZones/Get */
    async getTimeZones() {
      return reqGet("/Calendar/TimeZones/Get");
    },
    /** GET Calendar/TimeZone/Get – display name for timezone_id */
    async getTimeZone(timezoneId) {
      return reqGet("/Calendar/TimeZone/Get", { timezone_id: timezoneId || self.timeZoneId });
    },
    /** GET Calendar/CreateWithParticipants */
    async createWithParticipants(name, companyKey, participantIds, description) {
      const q = {
        name,
        company_key: companyKey,
        participantids: Array.isArray(participantIds) ? participantIds.join(",") : String(participantIds)
      };
      if (description) q.description = description;
      return reqGet("/Calendar/CreateWithParticipants", q);
    },
    /** GET Calendar/EditWithParticipants */
    async editWithParticipants(calendarId, name, participantIds, description) {
      const q = {
        calendar_id: calendarId,
        name,
        participantids: Array.isArray(participantIds) ? participantIds.join(",") : String(participantIds)
      };
      if (description) q.description = description;
      return reqGet("/Calendar/EditWithParticipants", q);
    }
  };
});
function mapCalendarFromApi(d) {
  if (!d) return d;
  const pick = (...keys) => keys.reduce((v, k) => v ?? d[k], void 0);
  const n = (v) => v != null && v !== "" ? Number(v) : void 0;
  return {
    id: pick("id", "Id"),
    companyKey: pick("companyKey", "CompanyKey", "company_key"),
    calendarId: pick("calendarId", "CalendarId", "calendar_id") ?? "",
    name: pick("name", "Name"),
    timeZoneId: pick("timeZoneId", "TimeZoneId", "time_zone_id"),
    purpose: pick("purpose", "Purpose") ?? "",
    description: pick("description", "Description"),
    assignmentMethod: n(pick("assignmentMethod", "AssignmentMethod", "assignment_method")),
    duration: n(pick("duration", "Duration")),
    durationUnit: n(pick("durationUnit", "DurationUnit", "duration_unit")),
    minimumBookingNotice: n(pick("minimumBookingNotice", "MinimumBookingNotice", "minimum_booking_notice")),
    minimumBookingNoticeUnit: n(pick("minimumBookingNoticeUnit", "MinimumBookingNoticeUnit", "minimum_booking_notice_unit")),
    minimumCancelationNotice: n(pick("minimumCancelationNotice", "MinimumCancelationNotice", "minimum_cancelation_notice")),
    minimumCancelationNoticeUnit: n(pick("minimumCancelationNoticeUnit", "MinimumCancelationNoticeUnit", "minimum_cancelation_notice_unit")),
    futureLimit: n(pick("futureLimit", "FutureLimit", "future_limit")),
    futureLimitUnit: n(pick("futureLimitUnit", "FutureLimitUnit", "future_limit_unit")),
    bufferTime: n(pick("bufferTime", "BufferTime", "buffer_time")),
    bufferTimeUnit: n(pick("bufferTimeUnit", "BufferTimeUnit", "buffer_time_unit")),
    bookingLimit: n(pick("bookingLimit", "BookingLimit", "booking_limit")),
    createdOn: pick("createdOn", "CreatedOn", "created_on"),
    modifiedOn: pick("modifiedOn", "ModifiedOn", "modified_on")
  };
}
CalendarModel.getRaw = async (calendarId) => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  return reqGet("/Calendar/Get", { calendar_id: calendarId });
};
CalendarModel.get = async (calendarId) => {
  var _a2, _b;
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const res = await reqGet("/Calendar/Get", { calendar_id: calendarId });
  if (res.status === "success" && res.data) {
    const raw = ((_a2 = res.data) == null ? void 0 : _a2.data) ?? ((_b = res.data) == null ? void 0 : _b.Data) ?? res.data;
    const mapped = mapCalendarFromApi({ ...raw, calendar_id: calendarId });
    return CalendarModel.create(mapped, { env: getConfig() });
  }
  return null;
};
CalendarModel.getByCompany = async (companyKey, opts = {}) => {
  var _a2, _b, _c, _d;
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const query = { company_key: companyKey };
  const sortBy = opts.sortBy ?? opts.sort ?? opts.sort_column;
  if (sortBy != null && sortBy !== "") query.sort = sortBy;
  const sortOrderRaw = opts.sortOrder ?? opts.sort_dir;
  if (sortOrderRaw != null && String(sortOrderRaw).trim() !== "") {
    const u = String(sortOrderRaw).trim().toUpperCase();
    query.sort_dir = u.startsWith("DESC") ? "desc" : "asc";
  }
  if (opts.page != null) {
    query.page = opts.page;
    if (opts.page_size != null) query.page_size = opts.page_size;
  } else {
    if (opts.skip != null) query.skip = opts.skip;
    if (opts.take != null) query.take = opts.take;
  }
  const res = await reqGet("/Calendar/All", query);
  if (res.status === "success") {
    const calendarsRaw = Array.isArray(res.data) ? res.data : Array.isArray((_a2 = res.data) == null ? void 0 : _a2.Calendars) ? res.data.Calendars : Array.isArray((_b = res.data) == null ? void 0 : _b.calendars) ? res.data.calendars : null;
    if (calendarsRaw) {
      const calendars = calendarsRaw.map(
        (c) => CalendarModel.create(mapCalendarFromApi(c), { env: getConfig() })
      );
      const totalCount = Number(((_c = res.data) == null ? void 0 : _c.TotalCount) ?? ((_d = res.data) == null ? void 0 : _d.totalCount) ?? calendars.length);
      return { calendars, totalCount };
    }
  }
  return null;
};
CalendarModel.getTimeZones = async () => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const res = await reqGet("/Calendar/TimeZones/Get");
  return res.status === "success" && res.data != null ? res.data : null;
};
CalendarModel.getTimeZone = async (timezoneId) => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const res = await reqGet("/Calendar/TimeZone/Get", { timezone_id: timezoneId });
  return res.status === "success" && res.data != null ? res.data : null;
};
CalendarModel.getParticipants = async (calendarId) => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const res = await reqGet("/Calendar/Participant/All", { calendar_id: calendarId });
  if (res.status === "success" && Array.isArray(res.data)) {
    return res.data.map(
      (p) => CalendarParticipant_default.create({
        ...p,
        participantId: p.participantId ?? p.participant_id ?? "",
        calendarId: p.calendarId ?? p.calendar_id ?? calendarId,
        calendarParticipantId: p.calendarParticipantId ?? p.calendarparticipant_id ?? ""
      })
    );
  }
  return null;
};
CalendarModel.getCalendarParticipant = async (calendarId) => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const res = await reqGet("/Calendar/Participant/Get", { calendar_id: calendarId });
  if (res.status === "success" && Array.isArray(res.data)) {
    return res.data.map(
      (p) => CalendarParticipant_default.create({
        ...p,
        participantId: p.participantId ?? p.participant_id ?? "",
        calendarId: p.calendarId ?? p.calendar_id ?? calendarId,
        calendarParticipantId: p.calendarParticipantId ?? p.calendarparticipant_id ?? ""
      })
    );
  }
  return null;
};
CalendarModel.getParticipantsInfo = async (calendarId) => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const res = await reqGet("/Calendar/Participants/GetInfo", { calendar_id: calendarId });
  if (res.status === "success" && Array.isArray(res.data)) {
    return res.data.map(
      (p) => ParticipantInfo_default.create({
        participantId: p.participantId ?? p.participant_id ?? "",
        calendarParticipantId: p.calendarParticipantId ?? p.calendarparticipant_id ?? "",
        alias: p.alias ?? null,
        email: p.email ?? null,
        isApproved: p.isApproved ?? p.is_approved ?? false,
        emailProvider: p.emailProvider ?? p.email_provider ?? 0,
        isAvailable: p.isAvailable ?? p.is_available ?? false
      })
    );
  }
  return null;
};
CalendarModel.getMonth = async (calendarId, year, month) => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const res = await reqGet("/Calendar/Month/Get", { calendar_id: calendarId, year, month });
  if (res.status === "success" && Array.isArray(res.data)) {
    return res.data.map((d) => CalendarDay_default.create({ date: d.date ?? d.Date ?? "" }));
  }
  return null;
};
CalendarModel.getEvents = async (calendarId) => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const res = await reqGet("/Calendar/Events/Get", { calendar_id: calendarId });
  if (res.status === "success" && Array.isArray(res.data)) {
    return res.data.map(
      (ev) => Event_default.create(
        {
          ...ev,
          eventId: ev.eventId ?? ev.event_id ?? "",
          calendarId: ev.calendarId ?? ev.calendar_id ?? calendarId
        },
        { env: getConfig() }
      )
    );
  }
  return null;
};
CalendarModel.createWithParticipants = async (name, companyKey, participantIds, description, calendarId) => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const q = {
    name,
    company_key: companyKey,
    participantids: Array.isArray(participantIds) ? participantIds.join(",") : String(participantIds)
  };
  if (description) q.description = description;
  if (calendarId) q.calendar_id = calendarId;
  const res = await reqGet("/Calendar/CreateWithParticipants", q);
  if (res.status === "success" && res.data) {
    const id = typeof res.data === "string" ? res.data : res.data.calendarId ?? res.data.calendar_id;
    return CalendarModel.get(id);
  }
  return null;
};
CalendarModel.editWithParticipants = async (calendarId, name, participantIds, description) => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const q = {
    calendar_id: calendarId,
    name,
    participantids: Array.isArray(participantIds) ? participantIds.join(",") : String(participantIds)
  };
  if (description) q.description = description;
  const res = await reqGet("/Calendar/EditWithParticipants", q);
  if (res.status === "success") {
    return CalendarModel.get(calendarId);
  }
  return null;
};
var Calendar_default = CalendarModel;
var AvailabilityModel = types.model("Availability", {
  id: types.maybeNull(types.number),
  availabilityId: types.string,
  calendarId: types.string,
  participantId: types.string,
  createdOn: types.maybeNull(types.string),
  modifiedOn: types.maybeNull(types.string)
});
var Availability_default = AvailabilityModel;
var AvailabilityDetailModel = types.model("AvailabilityDetail", {
  id: types.maybeNull(types.number),
  availabilityId: types.string,
  sunday: types.optional(types.boolean, false),
  monday: types.optional(types.boolean, false),
  tuesday: types.optional(types.boolean, false),
  wednesday: types.optional(types.boolean, false),
  thursday: types.optional(types.boolean, false),
  friday: types.optional(types.boolean, false),
  saturday: types.optional(types.boolean, false),
  startHour: types.optional(types.number, 0),
  startMinute: types.optional(types.number, 0),
  endHour: types.optional(types.number, 0),
  endMinute: types.optional(types.number, 0),
  createdOn: types.maybeNull(types.string),
  modifiedOn: types.maybeNull(types.string)
});
var AvailabilityDetail_default = AvailabilityDetailModel;
var ParticipantModel = types.model("Participant", {
  id: types.optional(types.maybeNull(types.number), null),
  participantId: types.identifier,
  companyKey: types.optional(types.maybeNull(types.string), null),
  alias: types.optional(types.string, ""),
  email: types.optional(types.string, ""),
  isApproved: types.optional(types.boolean, false),
  isAvailable: types.optional(types.boolean, false),
  provider: types.optional(types.number, 0),
  createdOn: types.optional(types.maybeNull(types.string), null),
  modifiedOn: types.optional(types.maybeNull(types.string), null),
  isDeleted: types.optional(types.boolean, false)
}).actions((self) => {
  const { reqGet, reqPost } = createRequestHelpers(self, getEnv);
  return {
    /** GET participant/get – fetch this participant */
    async get() {
      const res = await reqGet("/participant/get", { participant_id: self.participantId });
      if (res.status === "success" && res.data) applySnapshot(self, mapFromApi2(res.data));
      return res;
    },
    /** POST participant/save – save participant (add or update) */
    async save() {
      const payload = toPayload(self);
      const res = await reqPost("/participant/save", payload);
      if (res.status === "success" && res.data) applySnapshot(self, mapFromApi2(res.data));
      return res;
    },
    /** POST participant/update – update participant */
    async update() {
      const payload = toPayload(self);
      const res = await reqPost("/participant/update", payload);
      if (res.status === "success" && res.data) applySnapshot(self, mapFromApi2(res.data));
      return res;
    },
    /** GET participant/remove – remove this participant */
    async remove() {
      return reqGet("/participant/remove", { participant_id: self.participantId });
    },
    /** GET participant/sendemail – send email to this participant */
    async sendEmail() {
      return reqGet("/participant/sendemail", { participant_id: self.participantId });
    },
    /** POST participant/migrate – migrate this participant id to user id */
    async migrate(userId) {
      return reqPost("/participant/migrate", {}, { participant_id: self.participantId, user_id: userId });
    },
    /** GET participant/calendars/get – calendars for this participant (paged) */
    async getCalendars(opts = {}) {
      var _a2, _b, _c, _d;
      const q = { participant_id: self.participantId };
      const sortBy = opts.sortBy ?? opts.sort ?? opts.sort_column;
      if (sortBy != null && sortBy !== "") q.sort = sortBy;
      const sortOrderRaw = opts.sortOrder ?? opts.sort_dir;
      if (sortOrderRaw != null && String(sortOrderRaw).trim() !== "") {
        const u = String(sortOrderRaw).trim().toUpperCase();
        q.sort_dir = u.startsWith("DESC") ? "desc" : "asc";
      }
      if (opts.page != null) {
        q.page = opts.page;
        if (opts.page_size != null) q.page_size = opts.page_size;
      } else {
        if (opts.skip != null) q.skip = opts.skip;
        if (opts.take != null) q.take = opts.take;
      }
      const res = await reqGet("/participant/calendars/get", q);
      if (res.status === "success") {
        const calendarsRaw = Array.isArray(res.data) ? res.data : Array.isArray((_a2 = res.data) == null ? void 0 : _a2.Calendars) ? res.data.Calendars : Array.isArray((_b = res.data) == null ? void 0 : _b.calendars) ? res.data.calendars : null;
        if (calendarsRaw) {
          const calendars = calendarsRaw.map(
            (c) => Calendar_default.create(mapCalendarFromApi2(c), { env: getConfig() })
          );
          const totalCount = Number(((_c = res.data) == null ? void 0 : _c.TotalCount) ?? ((_d = res.data) == null ? void 0 : _d.totalCount) ?? calendars.length);
          return { calendars, totalCount };
        }
      }
      return null;
    }
  };
});
function mapFromApi2(d) {
  if (!d) return d;
  const pick = (...keys) => keys.reduce((v, k) => v ?? d[k], void 0);
  const n = (v) => v != null && v !== "" ? Number(v) : void 0;
  return {
    participantId: String(pick("participantId", "ParticipantId", "participant_id") ?? ""),
    companyKey: pick("companyKey", "CompanyKey", "company_key") ?? null,
    alias: pick("alias", "Alias") ?? "",
    email: pick("email", "Email") ?? "",
    isApproved: Boolean(pick("isApproved", "IsApproved", "is_approved")),
    isAvailable: Boolean(pick("isAvailable", "IsAvailable", "is_available")),
    provider: n(pick("provider", "Provider")) ?? 0,
    createdOn: pick("createdOn", "CreatedOn", "created_on") ?? null,
    modifiedOn: pick("modifiedOn", "ModifiedOn", "modified_on") ?? null,
    isDeleted: Boolean(pick("isDeleted", "IsDeleted", "is_deleted"))
  };
}
function toPayload(self) {
  return {
    participantId: self.participantId,
    companyKey: self.companyKey ?? void 0,
    alias: self.alias,
    email: self.email,
    isApproved: self.isApproved,
    isAvailable: self.isAvailable,
    provider: self.provider
  };
}
function mapCalendarFromApi2(d) {
  if (!d) return d;
  const pick = (...keys) => keys.reduce((v, k) => v ?? d[k], void 0);
  const n = (v) => v != null && v !== "" ? Number(v) : void 0;
  return {
    id: pick("id", "Id"),
    companyKey: pick("companyKey", "CompanyKey", "company_key") ?? null,
    calendarId: String(pick("calendarId", "CalendarId", "calendar_id") ?? ""),
    name: pick("name", "Name") ?? null,
    timeZoneId: pick("timeZoneId", "TimeZoneId", "time_zone_id") ?? null,
    purpose: pick("purpose", "Purpose") ?? "",
    description: pick("description", "Description") ?? null,
    assignmentMethod: n(pick("assignmentMethod", "AssignmentMethod", "assignment_method")) ?? void 0,
    duration: n(pick("duration", "Duration")) ?? void 0,
    durationUnit: n(pick("durationUnit", "DurationUnit", "duration_unit")) ?? void 0,
    minimumBookingNotice: n(pick("minimumBookingNotice", "MinimumBookingNotice", "minimum_booking_notice")) ?? void 0,
    minimumBookingNoticeUnit: n(pick("minimumBookingNoticeUnit", "MinimumBookingNoticeUnit", "minimum_booking_notice_unit")) ?? void 0,
    minimumCancelationNotice: n(pick("minimumCancelationNotice", "MinimumCancelationNotice", "minimum_cancelation_notice")) ?? void 0,
    minimumCancelationNoticeUnit: n(pick("minimumCancelationNoticeUnit", "MinimumCancelationNoticeUnit", "minimum_cancelation_notice_unit")) ?? void 0,
    futureLimit: n(pick("futureLimit", "FutureLimit", "future_limit")) ?? void 0,
    futureLimitUnit: n(pick("futureLimitUnit", "FutureLimitUnit", "future_limit_unit")) ?? void 0,
    bufferTime: n(pick("bufferTime", "BufferTime", "buffer_time")) ?? void 0,
    bufferTimeUnit: n(pick("bufferTimeUnit", "BufferTimeUnit", "buffer_time_unit")) ?? void 0,
    bookingLimit: n(pick("bookingLimit", "BookingLimit", "booking_limit")) ?? void 0,
    createdOn: pick("createdOn", "CreatedOn", "created_on") ?? null,
    modifiedOn: pick("modifiedOn", "ModifiedOn", "modified_on") ?? null
  };
}
ParticipantModel.get = async (participantId) => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const res = await reqGet("/participant/get", { participant_id: participantId });
  if (res.status === "success" && res.data) {
    return ParticipantModel.create(mapFromApi2(res.data), { env: getConfig() });
  }
  return null;
};
ParticipantModel.getByIds = async (participantIds) => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const ids = Array.isArray(participantIds) ? participantIds.join(",") : String(participantIds);
  const res = await reqGet("/participant/participants/get", { participantids: ids });
  if (res.status === "success" && Array.isArray(res.data)) {
    return res.data.map((p) => ParticipantModel.create(mapFromApi2(p), { env: getConfig() }));
  }
  return null;
};
ParticipantModel.getAll = async (companyKey) => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const res = await reqGet("/Participant/All", { company_key: companyKey });
  if (res.status === "success" && Array.isArray(res.data)) {
    return res.data.map((p) => ParticipantModel.create(mapFromApi2(p), { env: getConfig() }));
  }
  return null;
};
ParticipantModel.add = async (payload, calendarId) => {
  const { reqPost } = createRequestHelpersFromEnv(getConfig());
  const query = calendarId ? { calendar_id: calendarId } : null;
  const res = await reqPost("/Participant/Add", payload, query);
  if (res.status === "success" && res.data) {
    return ParticipantModel.create(mapFromApi2(res.data), { env: getConfig() });
  }
  return null;
};
ParticipantModel.remove = async (participantId) => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  return reqGet("/participant/remove", { participant_id: participantId });
};
ParticipantModel.update = async (payload) => {
  const { reqPost } = createRequestHelpersFromEnv(getConfig());
  return reqPost("/participant/update", payload);
};
ParticipantModel.save = async (payload) => {
  const { reqPost } = createRequestHelpersFromEnv(getConfig());
  const res = await reqPost("/participant/save", payload);
  if (res.status === "success" && res.data) {
    return ParticipantModel.create(mapFromApi2(res.data), { env: getConfig() });
  }
  return null;
};
ParticipantModel.sendEmail = async (participantId) => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  return reqGet("/participant/sendemail", { participant_id: participantId });
};
ParticipantModel.migrate = async (participantId, userId) => {
  const { reqPost } = createRequestHelpersFromEnv(getConfig());
  return reqPost("/participant/migrate", {}, { participant_id: participantId, user_id: userId });
};
ParticipantModel.getCalendars = async (participantId, opts = {}) => {
  var _a2, _b, _c, _d;
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const q = { participant_id: participantId };
  const sortBy = opts.sortBy ?? opts.sort ?? opts.sort_column;
  if (sortBy != null && sortBy !== "") q.sort = sortBy;
  const sortOrderRaw = opts.sortOrder ?? opts.sort_dir;
  if (sortOrderRaw != null && String(sortOrderRaw).trim() !== "") {
    const u = String(sortOrderRaw).trim().toUpperCase();
    q.sort_dir = u.startsWith("DESC") ? "desc" : "asc";
  }
  if (opts.page != null) {
    q.page = opts.page;
    if (opts.page_size != null) q.page_size = opts.page_size;
  } else {
    if (opts.skip != null) q.skip = opts.skip;
    if (opts.take != null) q.take = opts.take;
  }
  const res = await reqGet("/participant/calendars/get", q);
  if (res.status === "success") {
    const calendarsRaw = Array.isArray(res.data) ? res.data : Array.isArray((_a2 = res.data) == null ? void 0 : _a2.Calendars) ? res.data.Calendars : Array.isArray((_b = res.data) == null ? void 0 : _b.calendars) ? res.data.calendars : null;
    if (calendarsRaw) {
      const calendars = calendarsRaw.map(
        (c) => Calendar_default.create(mapCalendarFromApi2(c), { env: getConfig() })
      );
      const totalCount = Number(((_c = res.data) == null ? void 0 : _c.TotalCount) ?? ((_d = res.data) == null ? void 0 : _d.totalCount) ?? calendars.length);
      return { calendars, totalCount };
    }
  }
  return null;
};
var Participant_default = ParticipantModel;
var OpeningHourModel = types.model("OpeningHour", {
  id: types.maybeNull(types.number),
  openingHourId: types.optional(types.string, ""),
  calendarId: types.string,
  participantId: types.string,
  day: types.optional(types.number, 0),
  startHour: types.optional(types.number, 0),
  startMinute: types.optional(types.number, 0),
  endHour: types.optional(types.number, 0),
  endMinute: types.optional(types.number, 0),
  off: types.optional(types.boolean, false),
  createdOn: types.maybeNull(types.string),
  modifiedOn: types.maybeNull(types.string)
});
var OpeningHour_default = OpeningHourModel;
var SettingModel = types.model("Setting", {
  id: types.optional(types.maybeNull(types.number), null),
  settingsId: types.optional(types.string, ""),
  calendarId: types.optional(types.string, ""),
  logo: types.optional(types.maybeNull(types.string), null),
  theme: types.optional(types.maybeNull(types.string), null),
  schedulingButtonText: types.optional(types.maybeNull(types.string), null),
  scheduledMessage: types.optional(types.maybeNull(types.string), null)
}).actions((self) => {
  const { reqGet, reqPost } = createRequestHelpers(self, getEnv);
  return {
    /** GET setting/get – fetch setting for this calendar */
    async get() {
      const res = await reqGet("/setting/get", { calendar_id: self.calendarId });
      if (res.status === "success" && res.data) applySnapshot(self, mapFromApi3(res.data));
      return res;
    },
    /** POST setting/save – save this setting */
    async save() {
      const payload = toPayload2(self);
      const res = await reqPost("/setting/save", payload);
      if (res.status === "success" && res.data) applySnapshot(self, mapFromApi3(res.data));
      return res;
    },
    /** POST setting/logo/upload – upload logo file for this calendar */
    async uploadLogo(file) {
      return SettingModel.uploadLogo(self.calendarId, file);
    }
  };
});
function mapFromApi3(d) {
  if (!d) return d;
  const pick = (...keys) => keys.reduce((v, k) => v ?? d[k], void 0);
  return {
    settingsId: String(pick("settingsId", "SettingsId", "settings_id") ?? ""),
    calendarId: String(pick("calendarId", "CalendarId", "calendar_id") ?? ""),
    logo: pick("logo", "Logo") ?? null,
    theme: pick("theme", "Theme") ?? null,
    schedulingButtonText: pick("schedulingButtonText", "SchedulingButtonText", "scheduling_button_text") ?? null,
    scheduledMessage: pick("scheduledMessage", "ScheduledMessage", "scheduled_message") ?? null
  };
}
function toPayload2(self) {
  return {
    settingsId: self.settingsId || void 0,
    calendarId: self.calendarId,
    logo: self.logo ?? void 0,
    theme: self.theme ?? void 0,
    schedulingButtonText: self.schedulingButtonText ?? void 0,
    scheduledMessage: self.scheduledMessage ?? void 0
  };
}
SettingModel.get = async (calendarId) => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const res = await reqGet("/setting/get", { calendar_id: calendarId });
  if (res.status === "success" && res.data) {
    return SettingModel.create(mapFromApi3(res.data), { env: getConfig() });
  }
  return null;
};
SettingModel.save = async (payload) => {
  const { reqPost } = createRequestHelpersFromEnv(getConfig());
  return reqPost("/setting/save", payload);
};
SettingModel.uploadLogo = async (calendarId, file) => {
  const cfg = getConfig();
  if (!(cfg == null ? void 0 : cfg.baseUrl)) throw new Error("Configure baseUrl before uploadLogo");
  const fetchFn = cfg.fetch ?? (typeof fetch !== "undefined" ? fetch : () => {
    throw new Error("fetch not available");
  });
  const baseUrl = String(cfg.baseUrl).replace(/\/+$/, "");
  const url = `${baseUrl}/setting/logo/upload?calendar_id=${encodeURIComponent(calendarId)}`;
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetchFn(url, {
    method: "POST",
    body: formData
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { status: "failure", message: text || res.statusText };
  }
  if (!res.ok && data.status !== "failure") {
    data.status = "failure";
    data.message = data.message ?? `HTTP ${res.status}`;
  }
  return data;
};
var Setting_default = SettingModel;
var CompanyModel = types.model("Company", {
  id: types.optional(types.maybeNull(types.number), null),
  companyKey: types.identifier,
  companyName: types.optional(types.string, ""),
  createdOn: types.optional(types.maybeNull(types.string), null),
  modifiedOn: types.optional(types.maybeNull(types.string), null)
}).actions((self) => {
  const { reqGet, reqPost } = createRequestHelpers(self, getEnv);
  return {
    /** GET Company/Get – fetch this company */
    async get() {
      const res = await reqGet("/Company/Get", { company_key: self.companyKey });
      if (res.status === "success" && res.data) applySnapshot(self, mapFromApi4(res.data));
      return res;
    },
    /** POST Company/Save – save this company */
    async save() {
      const payload = toPayload3(self);
      const res = await reqPost("/Company/Save", payload);
      if (res.status === "success" && res.data) applySnapshot(self, mapFromApi4(res.data));
      return res;
    }
  };
});
function mapFromApi4(d) {
  if (!d) return d;
  const pick = (...keys) => keys.reduce((v, k) => v ?? d[k], void 0);
  return {
    companyKey: String(pick("companyKey", "CompanyKey", "company_key") ?? ""),
    companyName: pick("companyName", "CompanyName", "company_name") ?? "",
    createdOn: pick("createdOn", "CreatedOn", "created_on") ?? null,
    modifiedOn: pick("modifiedOn", "ModifiedOn", "modified_on") ?? null
  };
}
function toPayload3(self) {
  return {
    companyKey: self.companyKey,
    companyName: self.companyName ?? void 0
  };
}
CompanyModel.get = async (companyKey) => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const res = await reqGet("/Company/Get", { company_key: companyKey });
  if (res.status === "success" && res.data) {
    return CompanyModel.create(mapFromApi4(res.data), { env: getConfig() });
  }
  return null;
};
CompanyModel.getAll = async () => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const res = await reqGet("/Company/All");
  if (res.status === "success" && Array.isArray(res.data)) {
    return res.data.map((c) => CompanyModel.create(mapFromApi4(c), { env: getConfig() }));
  }
  return null;
};
CompanyModel.save = async (payload) => {
  const { reqPost } = createRequestHelpersFromEnv(getConfig());
  const res = await reqPost("/Company/Save", payload);
  if (res.status === "success" && res.data) {
    return CompanyModel.create(mapFromApi4(res.data), { env: getConfig() });
  }
  return null;
};
var Company_default = CompanyModel;
var PreferenceScope = {
  Global: 0,
  Consumer: 1,
  Company: 2,
  Calendar: 3,
  Event: 4
};
var SCOPE_NAMES = ["Global", "Consumer", "Company", "Calendar", "Event"];
var PreferenceModel = types.model("Preference", {
  id: types.optional(types.maybeNull(types.number), null),
  preferenceId: types.optional(types.maybeNull(types.string), null),
  level: types.optional(types.number, 0),
  primaryKey: types.optional(types.string, ""),
  preferenceOption: types.optional(types.string, ""),
  optionsJson: types.optional(types.maybeNull(types.string), null)
}).actions((self) => ({
  /** POST /preference/{scope}/{key}/{option} – save this preference to the API. */
  async save() {
    const scope = SCOPE_NAMES[self.level] ?? "Global";
    return PreferenceModel.set(scope, self.primaryKey, self.preferenceOption, self.optionsJson ?? "{}");
  },
  /** GET /preference/remove?preference_id={id} – remove this preference from the API. Requires preferenceId from a prior get. */
  async delete() {
    if (!self.preferenceId) throw new Error("preferenceId required for delete; use PreferenceModel.delete(preferenceId) or load preference from get first.");
    return PreferenceModel.delete(self.preferenceId);
  }
}));
PreferenceModel.getScopes = async () => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const res = await reqGet("/preference/scopes");
  return res.status === "success" && res.data != null ? res.data : null;
};
PreferenceModel.getOptions = async () => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const res = await reqGet("/preference/options");
  return res.status === "success" && res.data != null ? res.data : null;
};
PreferenceModel.getOptionTemplate = async (option) => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const res = await reqGet(`/preference/options/${encodeURIComponent(option)}`);
  return res.status === "success" && res.data != null ? res.data : null;
};
PreferenceModel.get = async (option, keys) => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const keysArr = Array.isArray(keys) ? keys : keys != null ? [String(keys)] : [];
  const query = keysArr.length ? { keys: keysArr } : {};
  const res = await reqGet(`/preference/${encodeURIComponent(option)}`, query);
  return res.status === "success" && res.data != null ? res.data : null;
};
PreferenceModel.set = async (scope, key, option, body) => {
  const { req } = createRequestHelpersFromEnv(getConfig());
  const path = `/preference/${encodeURIComponent(scope)}/${encodeURIComponent(key)}/${encodeURIComponent(option)}`;
  const payload = typeof body === "string" ? body : JSON.stringify(body ?? {});
  return req(path, { method: "POST", body: payload });
};
PreferenceModel.delete = async (preferenceId) => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  return reqGet("/preference/remove", { preference_id: preferenceId });
};
var Preference_default = PreferenceModel;
function mapFlowFromApi(d) {
  if (!d) return d;
  const pick = (...keys) => keys.reduce((v, k) => v ?? d[k], void 0);
  const b = (v) => v === true || v === "true" || v === 1;
  return {
    id: pick("id", "Id") ?? null,
    flowId: pick("flowId", "FlowId", "flow_id") ?? "",
    companyKey: pick("companyKey", "CompanyKey", "company_key") ?? "",
    name: pick("name", "Name") ?? "",
    description: pick("description", "Description") ?? null,
    flowJson: pick("flowJson", "FlowJson", "flow_json") ?? "",
    isActive: b(pick("isActive", "IsActive", "is_active")) ?? true,
    isDeleted: b(pick("isDeleted", "IsDeleted", "is_deleted")) ?? false,
    createdOn: pick("createdOn", "CreatedOn", "created_on") ?? null,
    modifiedOn: pick("modifiedOn", "ModifiedOn", "modified_on") ?? null
  };
}
var FlowModel = types.model("Flow", {
  id: types.optional(types.maybeNull(types.number), null),
  flowId: types.optional(types.identifier, "new"),
  companyKey: types.optional(types.maybeNull(types.string), null),
  name: types.optional(types.maybeNull(types.string), null),
  description: types.optional(types.maybeNull(types.string), null),
  flowJson: types.optional(types.string, ""),
  isActive: types.optional(types.boolean, true),
  isDeleted: types.optional(types.boolean, false),
  createdOn: types.optional(types.maybeNull(types.string), null),
  modifiedOn: types.optional(types.maybeNull(types.string), null)
}).actions((self) => {
  const { reqGet, reqPost } = createRequestHelpers(self, getEnv);
  return {
    /** GET flow/get – fetch this flow by flowId */
    async get() {
      if (!self.flowId || self.flowId === "new") return { status: "failure", message: "flowId required" };
      const res = await reqGet("/flow/get", { flow_id: self.flowId });
      if (res.status === "success" && res.data) {
        applySnapshot(self, mapFlowFromApi(res.data));
      }
      return res;
    },
    /** POST flow/create – create flow from current snapshot */
    async create() {
      const payload = {
        companyKey: self.companyKey ?? void 0,
        name: self.name ?? void 0,
        description: self.description ?? void 0,
        flowJson: self.flowJson || void 0,
        isActive: self.isActive
      };
      const res = await reqPost("/flow/create", payload);
      if (res.status === "success" && res.data) {
        applySnapshot(self, mapFlowFromApi(res.data));
      }
      return res;
    },
    /** POST flow/update – update flow */
    async update() {
      if (!self.flowId || self.flowId === "new") return { status: "failure", message: "flowId required" };
      const payload = {
        flowId: self.flowId,
        name: self.name ?? void 0,
        description: self.description ?? void 0,
        flowJson: self.flowJson || void 0,
        isActive: self.isActive
      };
      const res = await reqPost("/flow/update", payload);
      if (res.status === "success" && res.data) {
        applySnapshot(self, mapFlowFromApi(res.data));
      }
      return res;
    },
    /** POST flow/delete – soft delete flow */
    async delete() {
      if (!self.flowId || self.flowId === "new") return { status: "failure", message: "flowId required" };
      return reqPost("/flow/delete", { flow_id: self.flowId });
    },
    /** POST flow/duplicate – duplicate flow; applies snapshot if new flow returned */
    async duplicate(newName) {
      if (!self.flowId || self.flowId === "new") return { status: "failure", message: "flowId required" };
      const res = await reqPost("/flow/duplicate", { flow_id: self.flowId, new_name: newName ?? void 0 });
      if (res.status === "success" && res.data) {
        applySnapshot(self, mapFlowFromApi(res.data));
      }
      return res;
    },
    /** GET flow/appearance/get – uses self.flowId */
    async getAppearance() {
      if (!self.flowId || self.flowId === "new") return { status: "failure", message: "flowId required" };
      return FlowModel.getAppearance(self.flowId);
    },
    /** POST flow/appearance/save – merges self.flowId into payload */
    async saveAppearance(payload = {}) {
      if (!self.flowId || self.flowId === "new") return { status: "failure", message: "flowId required" };
      const body = { ...payload, flowId: self.flowId };
      return FlowModel.saveAppearance(body);
    },
    /** GET flow/embed/get – uses self.flowId */
    async getEmbed() {
      if (!self.flowId || self.flowId === "new") return { status: "failure", message: "flowId required" };
      return FlowModel.getEmbed(self.flowId);
    },
    /** POST flow/embed/save – merges self.flowId into payload */
    async saveEmbed(payload = {}) {
      if (!self.flowId || self.flowId === "new") return { status: "failure", message: "flowId required" };
      const body = { ...payload, flowId: self.flowId };
      return FlowModel.saveEmbed(body);
    },
    /** GET flow/public/get – uses self.flowId */
    async getPublic() {
      if (!self.flowId || self.flowId === "new") return { status: "failure", message: "flowId required" };
      return FlowModel.getPublic(self.flowId);
    },
    /** GET flow/preview/get – same as getPublic */
    async getPreview() {
      if (!self.flowId || self.flowId === "new") return { status: "failure", message: "flowId required" };
      return FlowModel.getPreview(self.flowId);
    }
  };
});
FlowModel.getRaw = async (flowId) => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  return reqGet("/flow/get", { flow_id: flowId });
};
FlowModel.list = async (companyKey, includeDeleted = false) => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const query = { company_key: companyKey };
  if (includeDeleted) query.include_deleted = "true";
  const res = await reqGet("/flow/list", query);
  if (res.status === "success" && Array.isArray(res.data)) {
    return res.data.map((f) => FlowModel.create(mapFlowFromApi(f), { env: getConfig() }));
  }
  return null;
};
FlowModel.get = async (flowId) => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const res = await reqGet("/flow/get", { flow_id: flowId });
  if (res.status === "success" && res.data) {
    return FlowModel.create(mapFlowFromApi(res.data), { env: getConfig() });
  }
  return null;
};
FlowModel.createFlow = async (payload) => {
  const { reqPost } = createRequestHelpersFromEnv(getConfig());
  const res = await reqPost("/flow/create", payload);
  if (res.status === "success" && res.data) {
    return FlowModel.create(mapFlowFromApi(res.data), { env: getConfig() });
  }
  return null;
};
FlowModel.updateFlow = async (payload) => {
  const { reqPost } = createRequestHelpersFromEnv(getConfig());
  const res = await reqPost("/flow/update", payload);
  if (res.status === "success" && res.data) {
    return FlowModel.create(mapFlowFromApi(res.data), { env: getConfig() });
  }
  return null;
};
FlowModel.delete = async (flowId) => {
  const { reqPost } = createRequestHelpersFromEnv(getConfig());
  return reqPost("/flow/delete", { flow_id: flowId });
};
FlowModel.duplicate = async (flowId, newName) => {
  const { reqPost } = createRequestHelpersFromEnv(getConfig());
  const res = await reqPost("/flow/duplicate", { flow_id: flowId, new_name: newName ?? void 0 });
  if (res.status === "success" && res.data) {
    return FlowModel.create(mapFlowFromApi(res.data), { env: getConfig() });
  }
  return null;
};
FlowModel.getAppearance = async (flowId) => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const res = await reqGet("/flow/appearance/get", { flow_id: flowId });
  if (res.status === "success" && res.data != null) {
    const d = res.data;
    return {
      id: d.id ?? d.Id ?? null,
      flowId: d.flowId ?? d.FlowId ?? d.flow_id ?? flowId,
      appearanceJson: d.appearanceJson ?? d.AppearanceJson ?? d.appearance_json ?? "",
      createdOn: d.createdOn ?? d.CreatedOn ?? d.created_on ?? null,
      modifiedOn: d.modifiedOn ?? d.ModifiedOn ?? d.modified_on ?? null
    };
  }
  return null;
};
FlowModel.saveAppearance = async (payload) => {
  const { reqPost } = createRequestHelpersFromEnv(getConfig());
  const res = await reqPost("/flow/appearance/save", payload);
  if (res.status === "success" && res.data) {
    const d = res.data;
    return {
      id: d.id ?? d.Id ?? null,
      flowId: d.flowId ?? d.FlowId ?? d.flow_id ?? payload.flowId ?? payload.flow_id,
      appearanceJson: d.appearanceJson ?? d.AppearanceJson ?? d.appearance_json ?? "",
      createdOn: d.createdOn ?? d.CreatedOn ?? d.created_on ?? null,
      modifiedOn: d.modifiedOn ?? d.ModifiedOn ?? d.modified_on ?? null
    };
  }
  return null;
};
FlowModel.getEmbed = async (flowId) => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const res = await reqGet("/flow/embed/get", { flow_id: flowId });
  if (res.status === "success" && res.data != null) {
    const d = res.data;
    return {
      id: d.id ?? d.Id ?? null,
      flowId: d.flowId ?? d.FlowId ?? d.flow_id ?? flowId,
      embedJson: d.embedJson ?? d.EmbedJson ?? d.embed_json ?? "",
      createdOn: d.createdOn ?? d.CreatedOn ?? d.created_on ?? null,
      modifiedOn: d.modifiedOn ?? d.ModifiedOn ?? d.modified_on ?? null
    };
  }
  return null;
};
FlowModel.saveEmbed = async (payload) => {
  const { reqPost } = createRequestHelpersFromEnv(getConfig());
  const res = await reqPost("/flow/embed/save", payload);
  if (res.status === "success" && res.data) {
    const d = res.data;
    return {
      id: d.id ?? d.Id ?? null,
      flowId: d.flowId ?? d.FlowId ?? d.flow_id ?? payload.flowId ?? payload.flow_id,
      embedJson: d.embedJson ?? d.EmbedJson ?? d.embed_json ?? "",
      createdOn: d.createdOn ?? d.CreatedOn ?? d.created_on ?? null,
      modifiedOn: d.modifiedOn ?? d.ModifiedOn ?? d.modified_on ?? null
    };
  }
  return null;
};
FlowModel.getPublic = async (flowId) => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const res = await reqGet("/flow/public/get", { flow_id: flowId });
  if (res.status === "success" && res.data) {
    const d = res.data;
    return {
      flow: d.flow ? mapFlowFromApi(d.flow) : null,
      appearance: d.appearance ?? null,
      embed: d.embed ?? null
    };
  }
  return null;
};
FlowModel.getPreview = async (flowId) => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const res = await reqGet("/flow/preview/get", { flow_id: flowId });
  if (res.status === "success" && res.data) {
    const d = res.data;
    return {
      flow: d.flow ? mapFlowFromApi(d.flow) : null,
      appearance: d.appearance ?? null,
      embed: d.embed ?? null
    };
  }
  return null;
};
var Flow_default = FlowModel;
function mapLeadFromApi(d) {
  if (!d) return d;
  const pick = (...keys) => keys.reduce((v, k) => v ?? d[k], void 0);
  const leadTypeRaw = pick("leadType", "LeadType", "lead_type");
  let leadType = 2;
  if (typeof leadTypeRaw === "number" && Number.isFinite(leadTypeRaw)) {
    leadType = leadTypeRaw;
  } else if (typeof leadTypeRaw === "string" && leadTypeRaw.trim() !== "") {
    const lowered = leadTypeRaw.trim().toLowerCase();
    if (lowered === "sales") leadType = 0;
    else if (lowered === "service") leadType = 1;
    else if (lowered === "others") leadType = 2;
    else if (!Number.isNaN(Number(leadTypeRaw))) leadType = Number(leadTypeRaw);
  }
  return {
    id: pick("id", "Id") ?? null,
    leadId: pick("leadId", "LeadId", "lead_id") ?? "",
    email: pick("email", "Email") ?? "",
    name: pick("name", "Name") ?? "",
    phone: pick("phone", "Phone") ?? "",
    companyKey: pick("companyKey", "CompanyKey", "company_key") ?? "",
    source: pick("source", "Source") ?? "",
    leadType,
    referrerLink: pick("referrerLink", "ReferrerLink", "referrer_link") ?? "",
    createdOn: pick("createdOn", "CreatedOn", "created_on") ?? null,
    modifiedOn: pick("modifiedOn", "ModifiedOn", "modified_on") ?? null
  };
}
var LeadModel = types.model("Lead", {
  id: types.optional(types.maybeNull(types.number), null),
  leadId: types.optional(types.identifier, "new"),
  email: types.optional(types.string, ""),
  name: types.optional(types.string, ""),
  phone: types.optional(types.string, ""),
  companyKey: types.optional(types.string, ""),
  source: types.optional(types.string, ""),
  leadType: types.optional(types.number, 2),
  referrerLink: types.optional(types.string, ""),
  createdOn: types.optional(types.maybeNull(types.string), null),
  modifiedOn: types.optional(types.maybeNull(types.string), null)
}).actions((self) => {
  const { reqGet, reqPost } = createRequestHelpers(self, getEnv);
  return {
    /** GET /lead/get – fetch this lead by leadId */
    async get() {
      if (!self.leadId || self.leadId === "new") return { status: "failure", message: "leadId required" };
      const res = await reqGet("/lead/get", { lead_id: self.leadId });
      if (res.status === "success" && res.data) {
        applySnapshot(self, mapLeadFromApi(res.data));
      }
      return res;
    },
    /** GET /lead/getbyemail – uses self.email and self.companyKey */
    async getByEmail() {
      if (!self.email || !self.companyKey) {
        return { status: "failure", message: "email and companyKey required on model" };
      }
      const lead = await LeadModel.getByEmail(self.email, self.companyKey);
      if (lead) {
        applySnapshot(self, getSnapshot(lead));
      }
      return { status: lead ? "success" : "failure", data: lead ?? void 0 };
    },
    /** GET /lead/company/get – uses self.companyKey; same result as LeadModel.getByCompany(companyKey, opts) */
    async getByCompany(opts = {}) {
      if (!self.companyKey) return null;
      return LeadModel.getByCompany(self.companyKey, opts);
    },
    /** POST /lead/create – create this lead */
    async createLead() {
      const payload = {
        email: self.email,
        name: self.name,
        phone: self.phone,
        companyKey: self.companyKey,
        source: self.source,
        leadType: self.leadType,
        referrerLink: self.referrerLink
      };
      const res = await reqPost("/lead/create", payload);
      if (res.status === "success" && res.data) {
        applySnapshot(self, mapLeadFromApi(res.data));
      }
      return res;
    },
    /** POST /lead/update – update this lead */
    async updateLead() {
      if (!self.leadId || self.leadId === "new") {
        return { status: "failure", message: "leadId required" };
      }
      const payload = {
        leadId: self.leadId,
        email: self.email,
        name: self.name,
        phone: self.phone,
        companyKey: self.companyKey,
        source: self.source,
        leadType: self.leadType,
        referrerLink: self.referrerLink
      };
      const res = await reqPost("/lead/update", payload);
      if (res.status === "success" && res.data) {
        applySnapshot(self, mapLeadFromApi(res.data));
      }
      return res;
    },
    /** GET /lead/delete – delete this lead by leadId */
    async deleteLead() {
      if (!self.leadId || self.leadId === "new") {
        return { status: "failure", message: "leadId required" };
      }
      return reqGet("/lead/delete", { lead_id: self.leadId });
    },
    /**
     * POST /lead/export/request – queue async full CSV export for self.companyKey (no list filters).
     * @param {object} [opts] – { notifyPath?, consumer? } consumer = Consumer header for completion webhook
     */
    async requestLeadExport(opts = {}) {
      if (!self.companyKey || String(self.companyKey).trim() === "") {
        return { status: "failure", message: "companyKey required on model" };
      }
      return LeadModel.requestExport(self.companyKey, opts);
    }
  };
});
LeadModel.getRaw = async (leadId) => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  return reqGet("/lead/get", { lead_id: leadId });
};
LeadModel.get = async (leadId) => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const res = await reqGet("/lead/get", { lead_id: leadId });
  if (res.status === "success" && res.data) {
    return LeadModel.create(mapLeadFromApi(res.data), { env: getConfig() });
  }
  return null;
};
LeadModel.getByEmail = async (email, companyKey) => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const res = await reqGet("/lead/getbyemail", { email, company_key: companyKey });
  if (res.status === "success" && res.data) {
    return LeadModel.create(mapLeadFromApi(res.data), { env: getConfig() });
  }
  return null;
};
LeadModel.getByCompany = async (companyKey, opts = {}) => {
  var _a2, _b;
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const query = { company_key: companyKey };
  const sortBy = opts.sortBy ?? opts.sort ?? opts.sort_column;
  if (sortBy != null && sortBy !== "") query.sort = sortBy;
  const sortOrderRaw = opts.sortOrder ?? opts.sort_dir;
  if (sortOrderRaw != null && String(sortOrderRaw).trim() !== "") {
    const u = String(sortOrderRaw).trim().toUpperCase();
    query.sort_dir = u.startsWith("DESC") ? "desc" : "asc";
  }
  const searchColumn = opts.searchColumn ?? opts.search_column ?? opts.column;
  if (searchColumn != null && String(searchColumn).trim() !== "") query.search_column = String(searchColumn).trim();
  const searchText = opts.searchText ?? opts.search_text ?? opts.search;
  if (searchText != null && String(searchText).trim() !== "") query.search_text = String(searchText).trim();
  if (opts.page != null) {
    query.page = opts.page;
    if (opts.page_size != null) query.page_size = opts.page_size;
  } else {
    if (opts.skip != null) query.skip = opts.skip;
    if (opts.take != null) query.take = opts.take;
  }
  const res = await reqGet("/lead/company/get", query);
  if (res.status === "success") {
    const leads = Array.isArray(res.data) ? res.data : Array.isArray((_a2 = res.data) == null ? void 0 : _a2.Leads) ? res.data.Leads : Array.isArray((_b = res.data) == null ? void 0 : _b.leads) ? res.data.leads : null;
    if (leads) {
      return leads.map((l) => LeadModel.create(mapLeadFromApi(l), { env: getConfig() }));
    }
  }
  return null;
};
LeadModel.createLead = async (payload) => {
  const { reqPost } = createRequestHelpersFromEnv(getConfig());
  const res = await reqPost("/lead/create", payload);
  if (res.status === "success" && res.data) {
    return LeadModel.create(mapLeadFromApi(res.data), { env: getConfig() });
  }
  return null;
};
LeadModel.updateLead = async (payload) => {
  const { reqPost } = createRequestHelpersFromEnv(getConfig());
  const res = await reqPost("/lead/update", payload);
  if (res.status === "success" && res.data) {
    return LeadModel.create(mapLeadFromApi(res.data), { env: getConfig() });
  }
  return null;
};
LeadModel.deleteLead = async (leadId) => {
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  return reqGet("/lead/delete", { lead_id: leadId });
};
LeadModel.requestExport = async (companyKey, opts = {}) => {
  const ck = companyKey != null ? String(companyKey).trim() : "";
  if (!ck) return { status: "failure", message: "companyKey required" };
  const { reqPost } = createRequestHelpersFromEnv(getConfig());
  const body = { company_key: ck };
  const np = opts.notifyPath ?? opts.notify_path;
  if (np != null && String(np).trim() !== "") {
    body.notify_path = String(np).trim();
  }
  const headers = {};
  const consumer = opts.consumer ?? opts.Consumer;
  if (consumer != null && String(consumer).trim() !== "") {
    headers.Consumer = String(consumer).trim();
  }
  return reqPost("/lead/export/request", body, void 0, { headers });
};
LeadModel.getSources = async (companyKey) => {
  var _a2;
  if (!companyKey || String(companyKey).trim() === "") return [];
  const { reqGet } = createRequestHelpersFromEnv(getConfig());
  const res = await reqGet("/lead/sources/get", { company_key: String(companyKey).trim() });
  if (res.status === "success") {
    const sources = Array.isArray(res.data) ? res.data : Array.isArray((_a2 = res.data) == null ? void 0 : _a2.sources) ? res.data.sources : null;
    if (sources) {
      return [...new Set(sources.map((s) => String(s ?? "").trim()).filter(Boolean))];
    }
  }
  return [];
};
var Lead_default = LeadModel;
var RootStore = types.model("RootStore", {
  calendars: types.optional(types.map(Calendar_default), {}),
  events: types.optional(types.map(Event_default), {})
}).actions((self) => ({
  addCalendar(snapshot) {
    const cal = Calendar_default.create(snapshot);
    self.calendars.set(cal.calendarId, cal);
    return cal;
  },
  addEvent(snapshot) {
    const ev = Event_default.create(snapshot);
    self.events.set(ev.eventId, ev);
    return ev;
  }
}));
function createRootStore(initialState = {}) {
  const env = getConfig();
  if (!env) throw new Error("Call configure({ baseUrl }) before createRootStore()");
  return RootStore.create(initialState, { env });
}
export {
  AssignmentMethod,
  AttendeeStatus,
  AvailabilityDetail_default as AvailabilityDetailModel,
  Availability_default as AvailabilityModel,
  CalendarDay_default as CalendarDayModel,
  Calendar_default as CalendarModel,
  CalendarParticipant_default as CalendarParticipantModel,
  Company_default as CompanyModel,
  ConfigModel_default as ConfigModel,
  DayOfWeek,
  Event_default as EventModel,
  Flow_default as FlowModel,
  Lead_default as LeadModel,
  OpeningHour_default as OpeningHourModel,
  ParticipantInfo_default as ParticipantInfoModel,
  Participant_default as ParticipantModel,
  Preference_default as PreferenceModel,
  PreferenceScope,
  RecurringFrequency,
  RootStore,
  Setting_default as SettingModel,
  TimeFrame_default as TimeFrameModel,
  TimeSlot_default as TimeSlotModel,
  Unit,
  configure,
  createRootStore,
  getConfig,
  getConfigStore,
  setBaseUrl
};
/*! Bundled license information:

mobx-state-tree/dist/mobx-state-tree.module.js:
  (*! *****************************************************************************
  Copyright (c) Microsoft Corporation.
  
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** *)
*/
//# sourceMappingURL=@blazeo__com_calendar-client.js.map
