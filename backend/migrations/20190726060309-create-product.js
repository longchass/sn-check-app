'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,

        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },

        // this is part of cisco 

        CVD_LINE_NUMBER: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        SO_NUMBER: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        DUP_SERIAL_NUMBER: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        QUANTITY: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        CONTRACT_BILLTO_ID: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        SUB_REF_ID: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        ITEM_DESCRIPTION: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        ADDITIONAL_ITEM_INFO: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        INSTANCE_ID: {
          type: Sequelize.STRING,
          allowNull: true
        },
        ITEM_NAME: {
          type: Sequelize.STRING,
          allowNull: true
        },
        PRICE_NEGOTIATED: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        ES_UPDATED_DATE: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        EU_PARTY_ID: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        INSTALL_GU_NAME: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        SERVICE_ORDER_ALLOWED_FLAG: {
          type: Sequelize.STRING,
          allowNull: true,
        },
 
        DUP_SERIAL_NUMBER_FLAG: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        INSTANCE_STATUS_DESC: {
          type: Sequelize.STRING,
          allowNull: true,
        },
  
        CONT_SITE_ORG_NAME: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        IB_PRODUCT_TYPE: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        IH_LICENSE_TYPE: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        WARRANTY_STATUS: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        WARRANTY_TYPE: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        CONT_SITE_ADDRESS1: {
          type: Sequelize.STRING,
          allowNull: true,
        },
  
        CONTRACT_SITE_POSTAL_CODE: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        CONT_SITE_ADDRESS2: {
          type: Sequelize.STRING,
          allowNull: true,
        },
  
        SERVICE_CATEGORY: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        CONT_SITE_ADDRESS3: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        LAST_DATE_OF_SUPPORT: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        PO_NUMBER: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        SERVICE_PROGRAM_GROUP: {
          type: Sequelize.STRING,
          allowNull: true,
        },
  
        CONT_SITE_ADDRESS4: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        WARRANTY_END_DATE: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        CUSTOMER_ORDER_ENABLED_FLAG: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        CONTRACT_SITE_STATE_PROV: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        SERIAL_NUMBER: {
          type: Sequelize.STRING,
          allowNull: true,
        },




      IS_LINE_DISABLED: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      CONTRACT_SITE_USE_ID: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      DESCRIPTION: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ITEM_TYPE_FLAG: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      CONTRACT_SITE_COUNTRY: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      SHIP_DATE: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      MAPPED_TO_SERVICE_FLAG: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      CONTRACT_SITE_CITY: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      CONTRACT_SITE_CUSTOMER_NAME: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ITEM_TYPE: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      INSTANCE_NUMBER: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      BILL_TO_SITE_USE_ID: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      ITEM_PATH: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      PARENT_INSTANCE_ID: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      CARTON_ID: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      WARRANTY_START_DATE: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      MSA_FLAG: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      FBP_FLAG: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      dataProtectionRequiredForExternalUsers: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      WARRANTY_COVERAGE_TEMPLATE: {
        type: Sequelize.STRING,
        allowNull: true,
      },






      RESELLER_PARTY_ID: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      INSTALL_AT_PARTY_ID: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      COVERED_LINE_ID: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      INSTANCE_STATUS_ID: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      DISTI_BILLTO_ID: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      INVENTORY_ITEM_ID: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      INSTALL_GU_ID: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ORIGINAL_SHIP_DATE: {
        type: Sequelize.STRING,
        allowNull: true,
      },


      PRIMARY_SECONDARY_FLAG: {
        type: Sequelize.STRING,
        allowNull: true,
      },


      REPLACED_INSTANCE_ID: {
        type: Sequelize.STRING,
        allowNull: true,
      },


      CONTRACT_ACCESS: {
        type: Sequelize.STRING,
        allowNull: true,
      },


      SHIP_TO_SITE_USE_ID: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      CURRENCY_CODE: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      siteLabel: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ENTITLE_PARTY: {
        type: Sequelize.STRING,
        allowNull: true,
      },


      // -----end------
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Products');
  }
};