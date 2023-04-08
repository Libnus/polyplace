from django.apps import apps

for app in apps.get_app_configs():
    print(app.verbose_name, ":")
    for model in app.get_models():
        print("\t", model)
